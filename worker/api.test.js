import { describe, expect, it } from "vitest";
import app from "./index.js";

const env = {
  APP_ENV: "development",
  SEED_FIXTURES: "true",
};

async function json(response) {
  return response.json();
}

describe("worker API validation and public privacy", () => {
  it("fails closed when production bindings are missing", async () => {
    const response = await app.request("/api/health", undefined, {});
    expect(response.status).toBe(503);
    expect(await json(response)).toMatchObject({
      ok: false,
      missing: expect.arrayContaining(["DATABASE_URL", "CLERK_SECRET_KEY"]),
    });
  });

  it("rejects invalid ratings and missing consent", async () => {
    const invalidRating = await app.request(
      "/api/public/forms/share-your-story/submissions",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Rating Test",
          text: "This testimonial has an invalid rating value.",
          role: "",
          company: "",
          website: "",
          rating: 6,
          consent: true,
        }),
      },
      env
    );
    expect(invalidRating.status).toBe(400);

    const noConsent = await app.request(
      "/api/public/forms/share-your-story/submissions",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Consent Test",
          text: "This testimonial cannot be accepted without consent.",
          role: "",
          company: "",
          website: "",
          rating: 5,
          consent: false,
        }),
      },
      env
    );
    expect(noConsent.status).toBe(400);
  });

  it("returns a conflict for duplicate global slugs", async () => {
    const slug = `duplicate-${crypto.randomUUID().slice(0, 8)}`;
    const create = () =>
      app.request(
        "/api/forms",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ name: "Duplicate", slug }),
        },
        env
      );

    expect((await create()).status).toBe(201);
    expect((await create()).status).toBe(409);
  });

  it("validates upload type, size, expiry, and pending-media privacy", async () => {
    const invalidType = await app.request(
      "/api/public/forms/share-your-story/uploads",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fileName: "avatar.gif",
          mimeType: "image/gif",
          sizeBytes: 4,
          kind: "avatar",
        }),
      },
      env
    );
    expect(invalidType.status).toBe(400);

    const tooLarge = await app.request(
      "/api/public/forms/share-your-story/uploads",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fileName: "avatar.png",
          mimeType: "image/png",
          sizeBytes: 5 * 1024 * 1024 + 1,
          kind: "avatar",
        }),
      },
      env
    );
    expect(tooLarge.status).toBe(400);

    const signedResponse = await app.request(
      "/api/public/forms/share-your-story/uploads",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fileName: "avatar.png",
          mimeType: "image/png",
          sizeBytes: 4,
          kind: "avatar",
        }),
      },
      env
    );
    expect(signedResponse.status).toBe(201);
    const signed = await json(signedResponse);

    const expiredUrl = new URL(signed.uploadUrl);
    expiredUrl.searchParams.set("expires", "1");
    const expired = await app.request(
      `${expiredUrl.pathname}${expiredUrl.search}`,
      {
        method: "PUT",
        headers: { "content-type": "image/png" },
        body: new Uint8Array([1, 2, 3, 4]),
      },
      env
    );
    expect(expired.status).toBe(403);

    const uploadUrl = new URL(signed.uploadUrl);
    const uploaded = await app.request(
      `${uploadUrl.pathname}${uploadUrl.search}`,
      {
        method: "PUT",
        headers: { "content-type": "image/png" },
        body: new Uint8Array([1, 2, 3, 4]),
      },
      env
    );
    expect(uploaded.status).toBe(204);
    expect(
      (
        await app.request(`/media/${signed.mediaId}`, undefined, env)
      ).status
    ).toBe(404);

    const submission = await app.request(
      "/api/public/forms/share-your-story/submissions",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Private Photo",
          text: "This customer photo stays private until approval.",
          role: "",
          company: "",
          website: "",
          rating: 5,
          consent: true,
          avatarStorageKey: signed.storageKey,
        }),
      },
      env
    );
    expect(submission.status).toBe(201);
    expect(
      (
        await app.request(`/media/${signed.mediaId}`, undefined, env)
      ).status
    ).toBe(404);

    const testimonial = await json(submission);
    const approved = await app.request(
      `/api/testimonials/${testimonial.id}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: "approved" }),
      },
      env
    );
    expect(approved.status).toBe(200);
    expect(
      (
        await app.request(`/media/${signed.mediaId}`, undefined, env)
      ).status
    ).toBe(200);
  });

  it("rejects unverified upload object keys", async () => {
    const response = await app.request(
      "/api/public/forms/share-your-story/submissions",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: "Wrong Prefix",
          text: "This submission references an invalid object prefix.",
          role: "",
          company: "",
          website: "",
          rating: 5,
          consent: true,
          avatarStorageKey: "workspaces/other/logos/not-an-avatar.png",
        }),
      },
      env
    );
    expect(response.status).toBe(400);
  });
});
