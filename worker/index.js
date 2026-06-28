import { verifyToken } from "@clerk/backend";
import { Hono } from "hono";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  AVATAR_MAX_BYTES,
  LOGO_MAX_BYTES,
  folderCreateSchema,
  formCreateSchema,
  formPatchSchema,
  parse,
  publicSubmissionSchema,
  studioAssetSchema,
  testimonialCreateSchema,
  testimonialPatchSchema,
  uploadRequestSchema,
  workspacePatchSchema,
} from "./validation.js";
import { createMemoryRepository, createPostgresRepository } from "./repository.js";

const app = new Hono();
const repositories = new Map();
const developmentUploads = new Map();

function missingProductionBindings(env) {
  if (env.APP_ENV === "development") return [];
  return [
    ["DATABASE_URL", env.DATABASE_URL],
    ["CLERK_SECRET_KEY", env.CLERK_SECRET_KEY],
    ["APP_ORIGIN", env.APP_ORIGIN],
    ["R2_ACCOUNT_ID", env.R2_ACCOUNT_ID],
    ["R2_ACCESS_KEY_ID", env.R2_ACCESS_KEY_ID],
    ["R2_SECRET_ACCESS_KEY", env.R2_SECRET_ACCESS_KEY],
    ["R2_BUCKET_NAME", env.R2_BUCKET_NAME],
    ["MEDIA_BUCKET", env.MEDIA_BUCKET],
    ["PUBLIC_SUBMISSIONS", env.PUBLIC_SUBMISSIONS],
    ["PUBLIC_UPLOADS", env.PUBLIC_UPLOADS],
  ]
    .filter(([, value]) => !value)
    .map(([name]) => name);
}

function repositoryFor(env) {
  const databaseUrl = env.DATABASE_URL?.trim();
  if (!databaseUrl && env.APP_ENV !== "development") {
    throw Object.assign(new Error("DATABASE_URL is not configured."), {
      status: 503,
    });
  }
  const key = databaseUrl || `memory:${env.SEED_FIXTURES !== "false"}`;
  if (!repositories.has(key)) {
    repositories.set(
      key,
      databaseUrl
        ? createPostgresRepository(databaseUrl)
        : createMemoryRepository({ seedFixtures: env.SEED_FIXTURES !== "false" })
    );
  }
  return repositories.get(key);
}

function currentOrigin(request) {
  return new URL(request.url).origin;
}

function userFromClaims(claims) {
  const email =
    claims.email ??
    claims.email_address ??
    claims.primary_email_address ??
    "";
  const first = claims.first_name ?? "";
  const last = claims.last_name ?? "";
  return {
    id: claims.sub,
    email,
    name: claims.name ?? `${first} ${last}`.trim(),
    avatarUrl: claims.image_url ?? null,
  };
}

async function authenticate(c, next) {
  if (c.env.APP_ENV === "development" && !c.env.CLERK_SECRET_KEY) {
    c.set("user", {
      id: "local_development_user",
      email: "local@halo.test",
      name: "Halo",
      avatarUrl: null,
    });
    await next();
    return;
  }

  const authorization = c.req.header("Authorization") ?? "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!token) return c.json({ error: "Authentication required." }, 401);
  if (!c.env.CLERK_SECRET_KEY) {
    return c.json({ error: "Clerk is not configured." }, 503);
  }
  try {
    const claims = await verifyToken(token, {
      secretKey: c.env.CLERK_SECRET_KEY,
      ...(c.env.CLERK_JWT_KEY ? { jwtKey: c.env.CLERK_JWT_KEY } : {}),
      ...(c.env.APP_ORIGIN
        ? {
            authorizedParties: c.env.APP_ORIGIN.split(",")
              .map((origin) => origin.trim())
              .filter(Boolean),
          }
        : {}),
    });
    c.set("user", userFromClaims(claims));
    await next();
  } catch {
    return c.json({ error: "Your session is invalid or expired." }, 401);
  }
}

function parseJson(schema) {
  return async (c, next) => {
    let payload;
    try {
      payload = await c.req.json();
    } catch {
      return c.json({ error: "A valid JSON body is required." }, 400);
    }
    const result = parse(schema, payload);
    if (result.error) return c.json({ error: result.error }, 400);
    c.set("payload", result.data);
    await next();
  };
}

function requestKey(c, namespace) {
  const ip =
    c.req.header("CF-Connecting-IP") ??
    c.req.header("X-Forwarded-For")?.split(",")[0]?.trim() ??
    "anonymous";
  return `${namespace}:${ip}`;
}

async function enforceRateLimit(c, bindingName, namespace) {
  const binding = c.env[bindingName];
  if (!binding?.limit) return true;
  const result = await binding.limit({ key: requestKey(c, namespace) });
  return result.success;
}

function checkUpload(payload, expectedKind) {
  if (payload.kind !== expectedKind) {
    return `This endpoint only accepts ${expectedKind} uploads.`;
  }
  const maxBytes = expectedKind === "logo" ? LOGO_MAX_BYTES : AVATAR_MAX_BYTES;
  if (payload.sizeBytes > maxBytes) {
    return `${expectedKind === "logo" ? "Logos" : "Customer photos"} must be ${
      maxBytes / 1024 / 1024
    } MB or smaller.`;
  }
  return null;
}

function extensionFor(mimeType) {
  return { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" }[mimeType];
}

async function presignUpload(c, media) {
  const env = c.env;
  if (
    env.R2_ACCOUNT_ID &&
    env.R2_ACCESS_KEY_ID &&
    env.R2_SECRET_ACCESS_KEY &&
    env.R2_BUCKET_NAME
  ) {
    const client = new S3Client({
      region: "auto",
      endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: env.R2_ACCESS_KEY_ID,
        secretAccessKey: env.R2_SECRET_ACCESS_KEY,
      },
    });
    return getSignedUrl(
      client,
      new PutObjectCommand({
        Bucket: env.R2_BUCKET_NAME,
        Key: media.storageKey,
        ContentType: media.mimeType,
        ContentLength: media.sizeBytes,
      }),
      { expiresIn: 300 }
    );
  }
  if (env.APP_ENV !== "development") {
    throw Object.assign(new Error("R2 upload credentials are not configured."), {
      status: 503,
    });
  }
  const url = new URL(`/api/dev/uploads/${media.id}`, currentOrigin(c.req.raw));
  url.searchParams.set("key", media.storageKey);
  url.searchParams.set("expires", String(Date.now() + 300_000));
  return url.toString();
}

async function confirmUpload(env, repository, storageKey) {
  const media = await repository.mediaByStorageKey(storageKey);
  if (!media) return null;
  if (media.status === "ready") return media;
  const object = await env.MEDIA_BUCKET?.head?.(storageKey);
  if (!object) return null;
  if (
    Number(object.size) !== Number(media.sizeBytes) ||
    (object.httpMetadata?.contentType &&
      object.httpMetadata.contentType !== media.mimeType)
  ) {
    return null;
  }
  return repository.markMediaReady(media.id);
}

app.get("/api/health", (c) => {
  const missing = missingProductionBindings(c.env);
  return c.json(
    {
      ok: missing.length === 0,
      storage: c.env.DATABASE_URL ? "postgres" : "memory",
      environment: c.env.APP_ENV ?? "production",
      missing,
    },
    missing.length ? 503 : 200
  );
});

app.use("/api/bootstrap", authenticate);
app.get("/api/bootstrap", async (c) => {
  const data = await repositoryFor(c.env).bootstrap(c.get("user"));
  return c.json(data);
});

app.use("/api/workspace", authenticate);
app.patch("/api/workspace", parseJson(workspacePatchSchema), async (c) => {
  const workspace = await repositoryFor(c.env).updateWorkspace(
    c.get("user").id,
    c.get("payload")
  );
  return c.json(workspace);
});

app.use("/api/forms/*", authenticate);
app.use("/api/forms", authenticate);
app.post("/api/forms", parseJson(formCreateSchema), async (c) => {
  const form = await repositoryFor(c.env).createForm(c.get("user").id, c.get("payload"));
  return c.json(form, 201);
});
app.patch("/api/forms/:formId", parseJson(formPatchSchema), async (c) => {
  const form = await repositoryFor(c.env).updateForm(
    c.get("user").id,
    c.req.param("formId"),
    c.get("payload")
  );
  return form ? c.json(form) : c.json({ error: "Form not found." }, 404);
});
app.delete("/api/forms/:formId", async (c) => {
  const removed = await repositoryFor(c.env).deleteForm(
    c.get("user").id,
    c.req.param("formId")
  );
  return removed ? c.body(null, 204) : c.json({ error: "Form not found." }, 404);
});
app.post("/api/forms/:formId/duplicate", async (c) => {
  const form = await repositoryFor(c.env).duplicateForm(
    c.get("user").id,
    c.req.param("formId")
  );
  return form ? c.json(form, 201) : c.json({ error: "Form not found." }, 404);
});

app.use("/api/testimonials/*", authenticate);
app.use("/api/testimonials", authenticate);
app.post("/api/testimonials", parseJson(testimonialCreateSchema), async (c) => {
  const testimonial = await repositoryFor(c.env).createTestimonial(
    c.get("user").id,
    c.get("payload")
  );
  return c.json(testimonial, 201);
});
app.patch(
  "/api/testimonials/:testimonialId",
  parseJson(testimonialPatchSchema),
  async (c) => {
    const testimonial = await repositoryFor(c.env).updateTestimonial(
      c.get("user").id,
      c.req.param("testimonialId"),
      c.get("payload")
    );
    return testimonial
      ? c.json(testimonial)
      : c.json({ error: "Testimonial not found." }, 404);
  }
);
app.delete("/api/testimonials/:testimonialId", async (c) => {
  const removed = await repositoryFor(c.env).deleteTestimonial(
    c.get("user").id,
    c.req.param("testimonialId")
  );
  return removed
    ? c.body(null, 204)
    : c.json({ error: "Testimonial not found." }, 404);
});

app.use("/api/studio/*", authenticate);
app.post("/api/studio/folders", parseJson(folderCreateSchema), async (c) => {
  const folder = await repositoryFor(c.env).createFolder(
    c.get("user").id,
    c.get("payload")
  );
  return c.json(folder, 201);
});
app.delete("/api/studio/folders/:folderId", async (c) => {
  const removed = await repositoryFor(c.env).deleteFolder(
    c.get("user").id,
    c.req.param("folderId")
  );
  return removed ? c.body(null, 204) : c.json({ error: "Folder not found." }, 404);
});
app.put("/api/studio/assets", parseJson(studioAssetSchema), async (c) => {
  const asset = await repositoryFor(c.env).saveStudioAsset(
    c.get("user").id,
    c.get("payload")
  );
  return asset ? c.json(asset) : c.json({ error: "Studio asset not found." }, 404);
});
app.delete("/api/studio/:kind/:assetId", async (c) => {
  const kind = c.req.param("kind");
  if (!["widget", "wall"].includes(kind)) {
    return c.json({ error: "Studio asset type is invalid." }, 400);
  }
  const removed = await repositoryFor(c.env).deleteStudioAsset(
    c.get("user").id,
    kind,
    c.req.param("assetId")
  );
  return removed
    ? c.body(null, 204)
    : c.json({ error: "Studio asset not found." }, 404);
});

app.use("/api/uploads", authenticate);
app.post("/api/uploads", parseJson(uploadRequestSchema), async (c) => {
  const payload = c.get("payload");
  const validationError = checkUpload(payload, "logo");
  if (validationError) return c.json({ error: validationError }, 400);
  const repository = repositoryFor(c.env);
  const bootstrap = await repository.bootstrap(c.get("user"));
  const storageKey = `workspaces/${bootstrap.workspace.id}/logos/${crypto.randomUUID()}.${
    extensionFor(payload.mimeType)
  }`;
  const media = await repository.createMedia(c.get("user").id, {
    kind: "logo",
    storageKey,
    mimeType: payload.mimeType,
    sizeBytes: payload.sizeBytes,
    status: "uploaded",
  });
  const uploadUrl = await presignUpload(c, media);
  return c.json(
    {
      mediaId: media.id,
      storageKey,
      uploadUrl,
      expiresIn: 300,
      headers: { "Content-Type": payload.mimeType },
    },
    201
  );
});
app.use("/api/uploads/*", authenticate);
app.post("/api/uploads/:mediaId/complete", async (c) => {
  const repository = repositoryFor(c.env);
  const media = await repository.mediaByStorageKey(c.req.query("key") ?? "");
  const account = await repository.bootstrap(c.get("user"));
  if (
    !media ||
    media.id !== c.req.param("mediaId") ||
    media.kind !== "logo" ||
    media.workspaceId !== account.workspace.id
  ) {
    return c.json({ error: "Upload signature is invalid." }, 403);
  }
  const confirmed = await confirmUpload(c.env, repository, media.storageKey);
  return confirmed
    ? c.json({ mediaId: confirmed.id, status: "ready" })
    : c.json({ error: "The uploaded image could not be verified." }, 400);
});

app.put("/api/dev/uploads/:mediaId", async (c) => {
  if (c.env.APP_ENV !== "development") return c.json({ error: "Not found." }, 404);
  const repository = repositoryFor(c.env);
  const storageKey = c.req.query("key") ?? "";
  const expires = Number(c.req.query("expires") ?? 0);
  if (!Number.isFinite(expires) || expires < Date.now()) {
    return c.json({ error: "Upload signature has expired." }, 403);
  }
  const media = await repository.mediaByStorageKey(storageKey);
  if (!media || media.id !== c.req.param("mediaId")) {
    return c.json({ error: "Upload signature is invalid." }, 403);
  }
  const body = await c.req.arrayBuffer();
  if (body.byteLength !== media.sizeBytes) {
    return c.json({ error: "Uploaded file size does not match the signed request." }, 400);
  }
  const contentType = c.req.header("Content-Type") ?? "";
  if (contentType !== media.mimeType) {
    return c.json({ error: "Uploaded file type does not match the signed request." }, 400);
  }
  developmentUploads.set(media.storageKey, {
    body,
    contentType,
  });
  await repository.markMediaReady(media.id);
  return c.body(null, 204);
});

app.get("/api/public/forms/:formSlug", async (c) => {
  const data = await repositoryFor(c.env).publicForm(c.req.param("formSlug"));
  return data ? c.json({ form: data.form, brand: data.brand }) : c.json({ error: "Form not found." }, 404);
});
app.post(
  "/api/public/forms/:formSlug/submissions",
  parseJson(publicSubmissionSchema),
  async (c) => {
    if (
      !(await enforceRateLimit(
        c,
        "PUBLIC_SUBMISSIONS",
        `submission:${c.req.param("formSlug")}`
      ))
    ) {
      return c.json({ error: "Too many submissions. Please try again later." }, 429);
    }
    const payload = c.get("payload");
    if (payload.honeypot) return c.json({ ok: true }, 202);
    const repository = repositoryFor(c.env);
    if (payload.avatarStorageKey) {
      const verified = await confirmUpload(c.env, repository, payload.avatarStorageKey);
      if (!verified) return c.json({ error: "The uploaded image could not be verified." }, 400);
    }
    const testimonial = await repository.submitPublic(c.req.param("formSlug"), payload);
    return testimonial
      ? c.json({ id: testimonial.id, status: "pending" }, 201)
      : c.json({ error: "Form not found." }, 404);
  }
);
app.post(
  "/api/public/forms/:formSlug/uploads",
  parseJson(uploadRequestSchema),
  async (c) => {
    if (
      !(await enforceRateLimit(c, "PUBLIC_UPLOADS", `upload:${c.req.param("formSlug")}`))
    ) {
      return c.json({ error: "Too many upload requests. Please try again later." }, 429);
    }
    const payload = c.get("payload");
    const validationError = checkUpload(payload, "avatar");
    if (validationError) return c.json({ error: validationError }, 400);
    const repository = repositoryFor(c.env);
    const publicForm = await repository.publicForm(c.req.param("formSlug"));
    if (!publicForm) return c.json({ error: "Form not found." }, 404);
    const storageKey = `forms/${publicForm.form.id}/avatars/${crypto.randomUUID()}.${
      extensionFor(payload.mimeType)
    }`;
    const media = await repository.createPublicMedia(publicForm.workspaceId, {
      kind: "avatar",
      storageKey,
      mimeType: payload.mimeType,
      sizeBytes: payload.sizeBytes,
      status: "uploaded",
    });
    const uploadUrl = await presignUpload(c, media);
    return c.json(
      {
        mediaId: media.id,
        storageKey,
        uploadUrl,
        expiresIn: 300,
        headers: { "Content-Type": payload.mimeType },
      },
      201
    );
  }
);

app.get("/api/public/widgets/:widgetSlug", async (c) => {
  const data = await repositoryFor(c.env).publicWidget(c.req.param("widgetSlug"));
  return data ? c.json(data) : c.json({ error: "Widget not found." }, 404);
});
app.get("/api/public/walls/:wallSlug", async (c) => {
  const data = await repositoryFor(c.env).publicWall({ wallSlug: c.req.param("wallSlug") });
  return data ? c.json(data) : c.json({ error: "Wall not found." }, 404);
});
app.get("/api/public/workspaces/:workspaceSlug/wall", async (c) => {
  const data = await repositoryFor(c.env).publicWall({
    workspaceSlug: c.req.param("workspaceSlug"),
  });
  return data ? c.json(data) : c.json({ error: "Wall not found." }, 404);
});

app.get("/media/:mediaId", async (c) => {
  const repository = repositoryFor(c.env);
  const media = await repository.publicMedia(c.req.param("mediaId"));
  if (!media) return c.json({ error: "Media not found." }, 404);
  const local = developmentUploads.get(media.storageKey);
  if (local) {
    return new Response(local.body, {
      headers: {
        "Content-Type": local.contentType,
        "Cache-Control": "public, max-age=3600",
      },
    });
  }
  const object = await c.env.MEDIA_BUCKET?.get?.(media.storageKey);
  if (!object) return c.json({ error: "Media object not found." }, 404);
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=3600");
  headers.set("ETag", object.httpEtag);
  return new Response(object.body, { headers });
});

app.onError((error, c) => {
  console.error(error);
  const databaseConflict =
    error?.code === "23505" || error?.cause?.code === "23505";
  const status = databaseConflict ? 409 : error.status ?? 500;
  return c.json(
    {
      error:
        databaseConflict
          ? "That URL or name is already in use."
          : status >= 500
            ? "The request could not be completed."
            : error.message,
    },
    status
  );
});

app.notFound((c) => {
  if (c.req.path.startsWith("/api/") || c.req.path.startsWith("/media/")) {
    return c.json({ error: "Not found." }, 404);
  }
  return c.env.ASSETS?.fetch ? c.env.ASSETS.fetch(c.req.raw) : c.text("Not found", 404);
});

export default app;
