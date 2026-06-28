import { and, asc, desc, eq, inArray, isNull } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import {
  collectionForms,
  mediaAssets,
  studioFolders,
  tags,
  testimonialTags,
  testimonials,
  users,
  walls,
  wallTestimonials,
  widgets,
  widgetTestimonials,
  workspaceMembers,
  workspaces,
} from "./db/schema.js";
import {
  defaultCollectionForm,
  developmentFixtures,
  emptyAccountFixtures,
  publicTestimonial,
  uniqueSlug,
} from "./domain.js";
import { slugify } from "./validation.js";

const clone = (value) => structuredClone(value);
const nowIso = () => new Date().toISOString();

function normalizeTestimonial(fields, overrides = {}) {
  return {
    id: overrides.id ?? crypto.randomUUID(),
    formId: fields.formId ?? null,
    name: fields.name,
    role: fields.role ?? "",
    company: fields.company ?? "",
    website: fields.website ?? "",
    rating: fields.rating ?? 0,
    source: fields.source ?? "form",
    sourceUrl: fields.sourceUrl ?? "",
    status: fields.status ?? "pending",
    tags: fields.tags ?? [],
    text: fields.text,
    consentStatus: fields.consentStatus ?? "unknown",
    avatarUrl: overrides.avatarUrl ?? null,
    avatarAssetId: overrides.avatarAssetId ?? null,
    createdAt: overrides.createdAt ?? nowIso(),
    updatedAt: overrides.updatedAt ?? nowIso(),
  };
}

function normalizeAsset(kind, fields, overrides = {}) {
  return {
    id: overrides.id ?? fields.id ?? crypto.randomUUID(),
    kind,
    name: fields.name,
    slug: fields.slug,
    status: fields.status ?? "draft",
    folderId: fields.folderId ?? null,
    config: fields.config ?? {},
    testimonialIds: fields.testimonialIds ?? [],
    isPrimary: kind === "wall" ? Boolean(fields.isPrimary) : undefined,
    createdAt: overrides.createdAt ?? nowIso(),
    updatedAt: nowIso(),
  };
}

export function createMemoryRepository({ seedFixtures = true } = {}) {
  const accounts = new Map();
  const media = new Map();

  function accountFor(userId) {
    if (!accounts.has(userId)) {
      accounts.set(
        userId,
        seedFixtures ? developmentFixtures() : emptyAccountFixtures(userId)
      );
    }
    return accounts.get(userId);
  }

  function findAccountByWorkspace(workspaceId) {
    return [...accounts.values()].find((account) => account.workspace.id === workspaceId);
  }

  function allAccounts() {
    return [...accounts.values()];
  }

  function assertSlugAvailable(type, slug, currentId = null) {
    const collection = allAccounts().flatMap((account) => account[type]);
    if (collection.some((item) => item.slug === slug && item.id !== currentId)) {
      throw Object.assign(new Error("That URL slug is already in use."), { status: 409 });
    }
  }

  return {
    kind: "memory",

    async bootstrap(user) {
      return clone(accountFor(user.id));
    },

    async updateWorkspace(userId, patch) {
      const account = accountFor(userId);
      if (patch.slug && patch.slug !== account.workspace.slug) {
        if (allAccounts().some((item) => item.workspace.slug === patch.slug)) {
          throw Object.assign(new Error("That workspace slug is already in use."), {
            status: 409,
          });
        }
      }
      if (patch.logoAssetId) {
        const logo = media.get(patch.logoAssetId);
        if (
          !logo ||
          logo.workspaceId !== account.workspace.id ||
          logo.kind !== "logo" ||
          !logo.storageKey.startsWith(`workspaces/${account.workspace.id}/logos/`) ||
          logo.status !== "ready"
        ) {
          throw Object.assign(new Error("The selected logo is not available."), {
            status: 400,
          });
        }
      }
      Object.assign(account.workspace, patch);
      if (patch.logoAssetId !== undefined) {
        account.workspace.logoImage = patch.logoAssetId
          ? `/media/${patch.logoAssetId}`
          : null;
      }
      return clone(account.workspace);
    },

    async createForm(userId, fields) {
      const account = accountFor(userId);
      const occupied = new Set(allAccounts().flatMap((item) => item.forms.map((form) => form.slug)));
      const requested = fields.slug;
      const base = requested ?? slugify(fields.name) ?? "untitled-form";
      if (requested) assertSlugAvailable("forms", requested);
      const form = defaultCollectionForm({
        id: crypto.randomUUID(),
        name: fields.name,
        slug: requested ?? uniqueSlug(base, occupied),
        status: fields.status ?? "active",
        config: fields.config ?? {},
      });
      account.forms.unshift(form);
      return clone(form);
    },

    async updateForm(userId, formId, patch) {
      const account = accountFor(userId);
      const form = account.forms.find((item) => item.id === formId);
      if (!form) return null;
      if (patch.slug) assertSlugAvailable("forms", patch.slug, formId);
      Object.assign(form, patch);
      if (patch.config) form.config = clone(patch.config);
      return clone(form);
    },

    async deleteForm(userId, formId) {
      const account = accountFor(userId);
      const index = account.forms.findIndex((item) => item.id === formId);
      if (index < 0) return false;
      account.forms.splice(index, 1);
      return true;
    },

    async duplicateForm(userId, formId) {
      const account = accountFor(userId);
      const source = account.forms.find((item) => item.id === formId);
      if (!source) return null;
      const occupied = new Set(allAccounts().flatMap((item) => item.forms.map((form) => form.slug)));
      const duplicate = {
        ...clone(source),
        id: crypto.randomUUID(),
        name: `${source.name} copy`,
        slug: uniqueSlug(`${source.slug}-copy`, occupied),
        responses: 0,
      };
      account.forms.unshift(duplicate);
      return clone(duplicate);
    },

    async createTestimonial(userId, fields) {
      const account = accountFor(userId);
      if (
        fields.formId &&
        !account.forms.some((form) => form.id === fields.formId)
      ) {
        throw Object.assign(new Error("Form not found."), { status: 404 });
      }
      const testimonial = normalizeTestimonial(fields);
      account.testimonials.unshift(testimonial);
      return clone(testimonial);
    },

    async updateTestimonial(userId, testimonialId, patch) {
      const account = accountFor(userId);
      const testimonial = account.testimonials.find((item) => item.id === testimonialId);
      if (!testimonial) return null;
      Object.assign(testimonial, patch, { updatedAt: nowIso() });
      return clone(testimonial);
    },

    async deleteTestimonial(userId, testimonialId) {
      const account = accountFor(userId);
      const index = account.testimonials.findIndex(
        (item) => item.id === testimonialId
      );
      if (index < 0) return false;
      account.testimonials.splice(index, 1);
      return true;
    },

    async createFolder(userId, fields) {
      const account = accountFor(userId);
      if (account.folders.some((folder) => folder.name.toLowerCase() === fields.name.toLowerCase())) {
        throw Object.assign(new Error("A folder with that name already exists."), { status: 409 });
      }
      const folder = { id: crypto.randomUUID(), name: fields.name, createdAt: nowIso() };
      account.folders.push(folder);
      return clone(folder);
    },

    async deleteFolder(userId, folderId) {
      const account = accountFor(userId);
      const index = account.folders.findIndex((folder) => folder.id === folderId);
      if (index < 0) return false;
      account.folders.splice(index, 1);
      [...account.widgets, ...account.walls].forEach((asset) => {
        if (asset.folderId === folderId) asset.folderId = null;
      });
      return true;
    },

    async saveStudioAsset(userId, fields) {
      const account = accountFor(userId);
      const key = fields.kind === "widget" ? "widgets" : "walls";
      if (
        fields.folderId &&
        !account.folders.some((folder) => folder.id === fields.folderId)
      ) {
        throw Object.assign(new Error("Studio folder not found."), { status: 404 });
      }
      const ownedTestimonialIds = new Set(
        account.testimonials.map((testimonial) => testimonial.id)
      );
      if (fields.testimonialIds.some((id) => !ownedTestimonialIds.has(id))) {
        throw Object.assign(new Error("A selected testimonial was not found."), {
          status: 404,
        });
      }
      assertSlugAvailable(key, fields.slug, fields.id);
      const index = account[key].findIndex((item) => item.id === fields.id);
      const current = index >= 0 ? account[key][index] : null;
      const asset = normalizeAsset(fields.kind, fields, {
        id: current?.id,
        createdAt: current?.createdAt,
      });
      if (fields.kind === "wall" && asset.isPrimary) {
        account.walls.forEach((wall) => {
          wall.isPrimary = false;
        });
      }
      if (index >= 0) account[key][index] = asset;
      else account[key].unshift(asset);
      return clone(asset);
    },

    async deleteStudioAsset(userId, kind, assetId) {
      const account = accountFor(userId);
      const key = kind === "widget" ? "widgets" : "walls";
      const index = account[key].findIndex((asset) => asset.id === assetId);
      if (index < 0) return false;
      account[key].splice(index, 1);
      return true;
    },

    async publicForm(slug) {
      for (const account of allAccounts()) {
        const form = account.forms.find((item) => item.slug === slug && item.status === "active");
        if (form) {
          return {
            form: clone(form),
            brand: clone(account.workspace),
            workspaceId: account.workspace.id,
          };
        }
      }
      return null;
    },

    async submitPublic(slug, fields) {
      const publicData = await this.publicForm(slug);
      if (!publicData) return null;
      const account = findAccountByWorkspace(publicData.workspaceId);
      const mediaRecord = fields.avatarStorageKey
        ? [...media.values()].find(
            (item) =>
              item.storageKey === fields.avatarStorageKey &&
              item.workspaceId === publicData.workspaceId &&
              item.kind === "avatar" &&
              item.status === "ready"
          )
        : null;
      if (
        fields.avatarStorageKey &&
        (!mediaRecord ||
          !mediaRecord.storageKey.startsWith(
            `forms/${publicData.form.id}/avatars/`
          ))
      ) {
        throw Object.assign(new Error("The uploaded image could not be verified."), {
          status: 400,
        });
      }
      const testimonial = normalizeTestimonial(
        {
          ...fields,
          formId: publicData.form.id,
          source: "form",
          status: "pending",
          consentStatus: "granted",
        },
        {
          avatarAssetId: mediaRecord?.id ?? null,
          avatarUrl: mediaRecord ? `/media/${mediaRecord.id}` : null,
        }
      );
      account.testimonials.unshift(testimonial);
      if (mediaRecord) mediaRecord.testimonialId = testimonial.id;
      const form = account.forms.find((item) => item.id === publicData.form.id);
      form.responses = (form.responses ?? 0) + 1;
      return clone(testimonial);
    },

    async publicWidget(slug) {
      for (const account of allAccounts()) {
        const widget = account.widgets.find(
          (item) => item.slug === slug && item.status === "published"
        );
        if (!widget) continue;
        const selected = new Set(widget.testimonialIds);
        const approved = account.testimonials.filter(
          (item) => item.status === "approved" && (!selected.size || selected.has(item.id))
        );
        return {
          widget: clone(widget),
          brand: clone(account.workspace),
          testimonials: approved.map(publicTestimonial),
        };
      }
      return null;
    },

    async publicWall({ wallSlug, workspaceSlug }) {
      for (const account of allAccounts()) {
        if (workspaceSlug && account.workspace.slug !== workspaceSlug) continue;
        const wall = account.walls.find(
          (item) =>
            item.status === "published" &&
            (wallSlug ? item.slug === wallSlug : item.isPrimary)
        );
        if (!wall) continue;
        const selected = new Set(wall.testimonialIds);
        const approved = account.testimonials.filter(
          (item) => item.status === "approved" && (!selected.size || selected.has(item.id))
        );
        return {
          wall: clone(wall),
          brand: clone(account.workspace),
          testimonials: approved.map(publicTestimonial),
        };
      }
      return null;
    },

    async createMedia(userId, fields) {
      const account = accountFor(userId);
      const record = {
        id: crypto.randomUUID(),
        workspaceId: account.workspace.id,
        testimonialId: null,
        status: "uploaded",
        ...fields,
      };
      media.set(record.id, record);
      return clone(record);
    },

    async createPublicMedia(workspaceId, fields) {
      const record = {
        id: crypto.randomUUID(),
        workspaceId,
        testimonialId: null,
        status: "uploaded",
        ...fields,
      };
      media.set(record.id, record);
      return clone(record);
    },

    async markMediaReady(mediaId) {
      const record = media.get(mediaId);
      if (!record) return null;
      record.status = "ready";
      return clone(record);
    },

    async mediaByStorageKey(storageKey) {
      const record = [...media.values()].find((item) => item.storageKey === storageKey);
      return record ? clone(record) : null;
    },

    async publicMedia(mediaId) {
      const record = media.get(mediaId);
      if (!record || record.status !== "ready") return null;
      if (record.kind === "logo") return clone(record);
      const account = findAccountByWorkspace(record.workspaceId);
      const testimonial = account?.testimonials.find(
        (item) => item.id === record.testimonialId && item.status === "approved"
      );
      return testimonial ? clone(record) : null;
    },
  };
}

function mapForm(row, responseCount = 0) {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    status: row.status,
    responses: Number(responseCount),
    config: row.config,
  };
}

function mapWorkspace(row) {
  return {
    id: row.id,
    workspaceName: row.name,
    slug: row.slug,
    website: row.websiteUrl,
    brandColor: row.brandColor,
    logoAssetId: row.logoAssetId,
    logoImage: row.logoAssetId ? `/media/${row.logoAssetId}` : null,
  };
}

function mapTestimonial(row, tagNames = [], avatarAssetId = null) {
  return normalizeTestimonial(
    {
      formId: row.formId,
      name: row.customerName,
      role: row.customerRole,
      company: row.customerCompany,
      website: row.customerWebsite,
      rating: row.rating ?? 0,
      source: row.sourceType,
      sourceUrl: row.sourceUrl,
      status: row.status,
      tags: tagNames,
      text: row.displayContent,
      consentStatus: row.consentStatus,
    },
    {
      id: row.id,
      avatarAssetId,
      avatarUrl: avatarAssetId ? `/media/${avatarAssetId}` : null,
      createdAt: row.createdAt?.toISOString?.() ?? row.createdAt,
      updatedAt: row.updatedAt?.toISOString?.() ?? row.updatedAt,
    }
  );
}

function mapStudioAsset(kind, row, testimonialIds) {
  return {
    id: row.id,
    kind,
    name: row.name,
    slug: row.slug,
    status: row.status,
    folderId: row.folderId,
    config: row.config,
    testimonialIds,
    ...(kind === "wall" ? { isPrimary: row.isPrimary } : {}),
    createdAt: row.createdAt?.toISOString?.() ?? row.createdAt,
    updatedAt: row.updatedAt?.toISOString?.() ?? row.updatedAt,
  };
}

export function createPostgresRepository(databaseUrl) {
  const sqlClient = neon(databaseUrl);
  const db = drizzle(sqlClient);

  async function membership(userId) {
    const [record] = await db
      .select({ workspace: workspaces })
      .from(workspaceMembers)
      .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
      .where(eq(workspaceMembers.userId, userId))
      .limit(1);
    return record?.workspace ?? null;
  }

  async function ensureWorkspace(user) {
    let workspace = await membership(user.id);
    if (workspace) return workspace;

    await db
      .insert(users)
      .values({
        id: user.id,
        email: user.email ?? "",
        name: user.name ?? "",
        avatarUrl: user.avatarUrl ?? null,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: user.email ?? "",
          name: user.name ?? "",
          avatarUrl: user.avatarUrl ?? null,
          updatedAt: new Date(),
        },
      });

    const base = slugify(user.name || "workspace") || "workspace";
    const suffix = user.id.replace(/[^a-z0-9]/gi, "").slice(-8).toLowerCase();
    const [created] = await db
      .insert(workspaces)
      .values({ name: user.name ? `${user.name}'s workspace` : "My workspace", slug: `${base}-${suffix}` })
      .returning();
    const insertedMembership = await db
      .insert(workspaceMembers)
      .values({
        workspaceId: created.id,
        userId: user.id,
        role: "owner",
      })
      .onConflictDoNothing({ target: workspaceMembers.userId })
      .returning();
    if (!insertedMembership.length) {
      await db.delete(workspaces).where(eq(workspaces.id, created.id));
      return membership(user.id);
    }
    const defaultForm = defaultCollectionForm();
    await db.insert(collectionForms).values({
      workspaceId: created.id,
      name: defaultForm.name,
      slug: `${defaultForm.slug}-${suffix}`,
      status: defaultForm.status,
      config: defaultForm.config,
    });
    return created;
  }

  async function requireWorkspace(userId) {
    const workspace = await membership(userId);
    if (!workspace) {
      throw Object.assign(new Error("Workspace not found."), { status: 404 });
    }
    return workspace;
  }

  async function loadTestimonials(workspaceId) {
    const rows = await db
      .select()
      .from(testimonials)
      .where(and(eq(testimonials.workspaceId, workspaceId), isNull(testimonials.deletedAt)))
      .orderBy(desc(testimonials.createdAt));
    if (!rows.length) return [];
    const ids = rows.map((row) => row.id);
    const tagRows = await db
      .select({
        testimonialId: testimonialTags.testimonialId,
        name: tags.name,
      })
      .from(testimonialTags)
      .innerJoin(tags, eq(testimonialTags.tagId, tags.id))
      .where(inArray(testimonialTags.testimonialId, ids));
    const avatarRows = await db
      .select({ id: mediaAssets.id, testimonialId: mediaAssets.testimonialId })
      .from(mediaAssets)
      .where(
        and(
          inArray(mediaAssets.testimonialId, ids),
          eq(mediaAssets.kind, "avatar"),
          eq(mediaAssets.status, "ready")
        )
      );
    return rows.map((row) =>
      mapTestimonial(
        row,
        tagRows.filter((tag) => tag.testimonialId === row.id).map((tag) => tag.name),
        avatarRows.find((asset) => asset.testimonialId === row.id)?.id ?? null
      )
    );
  }

  async function loadAssets(workspaceId, kind) {
    const table = kind === "widget" ? widgets : walls;
    const joinTable = kind === "widget" ? widgetTestimonials : wallTestimonials;
    const ownerColumn = kind === "widget" ? joinTable.widgetId : joinTable.wallId;
    const rows = await db
      .select()
      .from(table)
      .where(eq(table.workspaceId, workspaceId))
      .orderBy(desc(table.updatedAt));
    if (!rows.length) return [];
    const selections = await db
      .select({
        ownerId: ownerColumn,
        testimonialId: joinTable.testimonialId,
        position: joinTable.position,
      })
      .from(joinTable)
      .where(inArray(ownerColumn, rows.map((row) => row.id)))
      .orderBy(asc(joinTable.position));
    return rows.map((row) =>
      mapStudioAsset(
        kind,
        row,
        selections
          .filter((selection) => selection.ownerId === row.id)
          .map((selection) => selection.testimonialId)
      )
    );
  }

  async function replaceTags(workspaceId, testimonialId, names) {
    await db.delete(testimonialTags).where(eq(testimonialTags.testimonialId, testimonialId));
    if (!names?.length) return;
    await db
      .insert(tags)
      .values(names.map((name) => ({ workspaceId, name })))
      .onConflictDoNothing();
    const tagRows = await db
      .select({ id: tags.id })
      .from(tags)
      .where(and(eq(tags.workspaceId, workspaceId), inArray(tags.name, names)));
    if (tagRows.length) {
      await db
        .insert(testimonialTags)
        .values(tagRows.map((tag) => ({ testimonialId, tagId: tag.id })));
    }
  }

  async function ownedForm(userId, formId) {
    const workspace = await requireWorkspace(userId);
    const [form] = await db
      .select()
      .from(collectionForms)
      .where(and(eq(collectionForms.id, formId), eq(collectionForms.workspaceId, workspace.id)))
      .limit(1);
    return { workspace, form };
  }

  async function ownedTestimonial(userId, testimonialId) {
    const workspace = await requireWorkspace(userId);
    const [testimonial] = await db
      .select()
      .from(testimonials)
      .where(and(eq(testimonials.id, testimonialId), eq(testimonials.workspaceId, workspace.id)))
      .limit(1);
    return { workspace, testimonial };
  }

  return {
    kind: "postgres",

    async bootstrap(user) {
      const workspace = await ensureWorkspace(user);
      const formRows = await db
        .select()
        .from(collectionForms)
        .where(eq(collectionForms.workspaceId, workspace.id))
        .orderBy(desc(collectionForms.updatedAt));
      const counts = await db
        .select({ formId: testimonials.formId, id: testimonials.id })
        .from(testimonials)
        .where(and(eq(testimonials.workspaceId, workspace.id), isNull(testimonials.deletedAt)));
      return {
        workspace: mapWorkspace(workspace),
        forms: formRows.map((form) =>
          mapForm(form, counts.filter((item) => item.formId === form.id).length)
        ),
        testimonials: await loadTestimonials(workspace.id),
        folders: await db
          .select()
          .from(studioFolders)
          .where(eq(studioFolders.workspaceId, workspace.id))
          .orderBy(asc(studioFolders.name)),
        widgets: await loadAssets(workspace.id, "widget"),
        walls: await loadAssets(workspace.id, "wall"),
      };
    },

    async updateWorkspace(userId, patch) {
      const workspace = await requireWorkspace(userId);
      if (patch.logoAssetId) {
        const [logo] = await db
          .select({
            id: mediaAssets.id,
            storageKey: mediaAssets.storageKey,
          })
          .from(mediaAssets)
          .where(
            and(
              eq(mediaAssets.id, patch.logoAssetId),
              eq(mediaAssets.workspaceId, workspace.id),
              eq(mediaAssets.kind, "logo"),
              eq(mediaAssets.status, "ready")
            )
          )
          .limit(1);
        if (
          !logo ||
          !logo.storageKey.startsWith(`workspaces/${workspace.id}/logos/`)
        ) {
          throw Object.assign(new Error("The selected logo is not available."), {
            status: 400,
          });
        }
      }
      const values = {
        ...(patch.workspaceName !== undefined ? { name: patch.workspaceName } : {}),
        ...(patch.slug !== undefined ? { slug: patch.slug } : {}),
        ...(patch.website !== undefined ? { websiteUrl: patch.website } : {}),
        ...(patch.brandColor !== undefined ? { brandColor: patch.brandColor } : {}),
        ...(patch.logoAssetId !== undefined ? { logoAssetId: patch.logoAssetId } : {}),
        updatedAt: new Date(),
      };
      const [updated] = await db
        .update(workspaces)
        .set(values)
        .where(eq(workspaces.id, workspace.id))
        .returning();
      return mapWorkspace(updated);
    },

    async createForm(userId, fields) {
      const workspace = await requireWorkspace(userId);
      let nextFields = fields;
      if (!fields.slug) {
        const existing = await db
          .select({ slug: collectionForms.slug })
          .from(collectionForms);
        const base = slugify(fields.name) || "untitled-form";
        nextFields = {
          ...fields,
          slug: uniqueSlug(base, new Set(existing.map((item) => item.slug))),
        };
      }
      const model = defaultCollectionForm(nextFields);
      const [created] = await db
        .insert(collectionForms)
        .values({
          workspaceId: workspace.id,
          name: model.name,
          slug: model.slug,
          status: model.status,
          config: model.config,
        })
        .returning();
      return mapForm(created, 0);
    },

    async updateForm(userId, formId, patch) {
      const { form } = await ownedForm(userId, formId);
      if (!form) return null;
      const [updated] = await db
        .update(collectionForms)
        .set({ ...patch, updatedAt: new Date() })
        .where(eq(collectionForms.id, formId))
        .returning();
      const responses = await db
        .select({ id: testimonials.id })
        .from(testimonials)
        .where(and(eq(testimonials.formId, formId), isNull(testimonials.deletedAt)));
      return mapForm(updated, responses.length);
    },

    async deleteForm(userId, formId) {
      const { form } = await ownedForm(userId, formId);
      if (!form) return false;
      await db.delete(collectionForms).where(eq(collectionForms.id, formId));
      return true;
    },

    async duplicateForm(userId, formId) {
      const { workspace, form } = await ownedForm(userId, formId);
      if (!form) return null;
      const existing = await db.select({ slug: collectionForms.slug }).from(collectionForms);
      const slug = uniqueSlug(`${form.slug}-copy`, new Set(existing.map((item) => item.slug)));
      const [created] = await db
        .insert(collectionForms)
        .values({
          workspaceId: workspace.id,
          name: `${form.name} copy`,
          slug,
          status: form.status,
          config: form.config,
        })
        .returning();
      return mapForm(created, 0);
    },

    async createTestimonial(userId, fields) {
      const workspace = await requireWorkspace(userId);
      if (fields.formId) {
        const [form] = await db
          .select({ id: collectionForms.id })
          .from(collectionForms)
          .where(
            and(
              eq(collectionForms.id, fields.formId),
              eq(collectionForms.workspaceId, workspace.id)
            )
          )
          .limit(1);
        if (!form) {
          throw Object.assign(new Error("Form not found."), { status: 404 });
        }
      }
      const [created] = await db
        .insert(testimonials)
        .values({
          workspaceId: workspace.id,
          formId: fields.formId ?? null,
          status: fields.status,
          originalContent: fields.text,
          displayContent: fields.text,
          rating: fields.rating || null,
          customerName: fields.name,
          customerRole: fields.role,
          customerCompany: fields.company,
          customerWebsite: fields.website,
          sourceType: fields.source,
          sourceUrl: fields.sourceUrl,
          consentStatus: fields.consentStatus,
          consentText: fields.consentText,
        })
        .returning();
      await replaceTags(workspace.id, created.id, fields.tags);
      return mapTestimonial(created, fields.tags);
    },

    async updateTestimonial(userId, testimonialId, patch) {
      const { workspace, testimonial } = await ownedTestimonial(userId, testimonialId);
      if (!testimonial) return null;
      const values = {
        ...(patch.name !== undefined ? { customerName: patch.name } : {}),
        ...(patch.text !== undefined
          ? { displayContent: patch.text, originalContent: patch.text }
          : {}),
        ...(patch.role !== undefined ? { customerRole: patch.role } : {}),
        ...(patch.company !== undefined ? { customerCompany: patch.company } : {}),
        ...(patch.rating !== undefined ? { rating: patch.rating || null } : {}),
        ...(patch.source !== undefined ? { sourceType: patch.source } : {}),
        ...(patch.status !== undefined ? { status: patch.status } : {}),
        updatedAt: new Date(),
      };
      const [updated] = await db
        .update(testimonials)
        .set(values)
        .where(eq(testimonials.id, testimonialId))
        .returning();
      if (patch.tags !== undefined) await replaceTags(workspace.id, testimonialId, patch.tags);
      const all = await loadTestimonials(workspace.id);
      return all.find((item) => item.id === updated.id) ?? null;
    },

    async deleteTestimonial(userId, testimonialId) {
      const { testimonial } = await ownedTestimonial(userId, testimonialId);
      if (!testimonial) return false;
      await db
        .update(testimonials)
        .set({ deletedAt: new Date(), updatedAt: new Date() })
        .where(eq(testimonials.id, testimonialId));
      return true;
    },

    async createFolder(userId, fields) {
      const workspace = await requireWorkspace(userId);
      const [folder] = await db
        .insert(studioFolders)
        .values({ workspaceId: workspace.id, name: fields.name })
        .returning();
      return folder;
    },

    async deleteFolder(userId, folderId) {
      const workspace = await requireWorkspace(userId);
      const removed = await db
        .delete(studioFolders)
        .where(
          and(
            eq(studioFolders.id, folderId),
            eq(studioFolders.workspaceId, workspace.id)
          )
        )
        .returning({ id: studioFolders.id });
      return removed.length > 0;
    },

    async saveStudioAsset(userId, fields) {
      const workspace = await requireWorkspace(userId);
      if (fields.folderId) {
        const [folder] = await db
          .select({ id: studioFolders.id })
          .from(studioFolders)
          .where(
            and(
              eq(studioFolders.id, fields.folderId),
              eq(studioFolders.workspaceId, workspace.id)
            )
          )
          .limit(1);
        if (!folder) {
          throw Object.assign(new Error("Studio folder not found."), { status: 404 });
        }
      }
      if (fields.testimonialIds.length) {
        const owned = await db
          .select({ id: testimonials.id })
          .from(testimonials)
          .where(
            and(
              eq(testimonials.workspaceId, workspace.id),
              inArray(testimonials.id, fields.testimonialIds),
              isNull(testimonials.deletedAt)
            )
          );
        if (owned.length !== new Set(fields.testimonialIds).size) {
          throw Object.assign(new Error("A selected testimonial was not found."), {
            status: 404,
          });
        }
      }
      const table = fields.kind === "widget" ? widgets : walls;
      const joinTable = fields.kind === "widget" ? widgetTestimonials : wallTestimonials;
      const ownerColumn = fields.kind === "widget" ? joinTable.widgetId : joinTable.wallId;
      let row;
      if (fields.id) {
        const [owned] = await db
          .select()
          .from(table)
          .where(and(eq(table.id, fields.id), eq(table.workspaceId, workspace.id)))
          .limit(1);
        if (!owned) return null;
        [row] = await db
          .update(table)
          .set({
            name: fields.name,
            slug: fields.slug,
            status: fields.status,
            folderId: fields.folderId,
            config: fields.config,
            ...(fields.kind === "wall" ? { isPrimary: Boolean(fields.isPrimary) } : {}),
            updatedAt: new Date(),
          })
          .where(eq(table.id, fields.id))
          .returning();
      } else {
        [row] = await db
          .insert(table)
          .values({
            workspaceId: workspace.id,
            name: fields.name,
            slug: fields.slug,
            status: fields.status,
            folderId: fields.folderId,
            config: fields.config,
            ...(fields.kind === "widget"
              ? { type: fields.config?.type ?? "grid" }
              : { isPrimary: Boolean(fields.isPrimary) }),
          })
          .returning();
      }
      if (fields.kind === "wall" && fields.isPrimary) {
        await db
          .update(walls)
          .set({ isPrimary: false })
          .where(eq(walls.workspaceId, workspace.id));
        await db.update(walls).set({ isPrimary: true }).where(eq(walls.id, row.id));
      }
      await db.delete(joinTable).where(eq(ownerColumn, row.id));
      if (fields.testimonialIds.length) {
        await db.insert(joinTable).values(
          fields.testimonialIds.map((testimonialId, position) => ({
            [fields.kind === "widget" ? "widgetId" : "wallId"]: row.id,
            testimonialId,
            position,
          }))
        );
      }
      return mapStudioAsset(fields.kind, row, fields.testimonialIds);
    },

    async deleteStudioAsset(userId, kind, assetId) {
      const workspace = await requireWorkspace(userId);
      const table = kind === "widget" ? widgets : walls;
      const removed = await db
        .delete(table)
        .where(and(eq(table.id, assetId), eq(table.workspaceId, workspace.id)))
        .returning({ id: table.id });
      return removed.length > 0;
    },

    async publicForm(slug) {
      const [result] = await db
        .select({ form: collectionForms, workspace: workspaces })
        .from(collectionForms)
        .innerJoin(workspaces, eq(collectionForms.workspaceId, workspaces.id))
        .where(and(eq(collectionForms.slug, slug), eq(collectionForms.status, "active")))
        .limit(1);
      return result
        ? {
            form: mapForm(result.form),
            brand: mapWorkspace(result.workspace),
            workspaceId: result.workspace.id,
          }
        : null;
    },

    async submitPublic(slug, fields) {
      const data = await this.publicForm(slug);
      if (!data) return null;
      let mediaRecord = null;
      if (fields.avatarStorageKey) {
        [mediaRecord] = await db
          .select()
          .from(mediaAssets)
          .where(
            and(
              eq(mediaAssets.workspaceId, data.workspaceId),
              eq(mediaAssets.storageKey, fields.avatarStorageKey),
              eq(mediaAssets.kind, "avatar"),
              eq(mediaAssets.status, "ready")
            )
          )
          .limit(1);
        if (
          !mediaRecord ||
          mediaRecord.testimonialId ||
          !mediaRecord.storageKey.startsWith(`forms/${data.form.id}/avatars/`)
        ) {
          throw Object.assign(new Error("The uploaded image could not be verified."), {
            status: 400,
          });
        }
      }
      const [created] = await db
        .insert(testimonials)
        .values({
          workspaceId: data.workspaceId,
          formId: data.form.id,
          status: "pending",
          originalContent: fields.text,
          displayContent: fields.text,
          rating: fields.rating || null,
          customerName: fields.name,
          customerRole: fields.role,
          customerCompany: fields.company,
          customerWebsite: fields.website,
          sourceType: "form",
          consentStatus: "granted",
          consentText: data.form.config?.consentText ?? "",
          consentGrantedAt: new Date(),
        })
        .returning();
      if (mediaRecord) {
        await db
          .update(mediaAssets)
          .set({ testimonialId: created.id })
          .where(eq(mediaAssets.id, mediaRecord.id));
      }
      return mapTestimonial(
        created,
        [],
        mediaRecord?.id ?? null
      );
    },

    async publicWidget(slug) {
      const [result] = await db
        .select({ widget: widgets, workspace: workspaces })
        .from(widgets)
        .innerJoin(workspaces, eq(widgets.workspaceId, workspaces.id))
        .where(and(eq(widgets.slug, slug), eq(widgets.status, "published")))
        .limit(1);
      if (!result) return null;
      const assets = await loadAssets(result.workspace.id, "widget");
      const widget = assets.find((item) => item.id === result.widget.id);
      const all = await loadTestimonials(result.workspace.id);
      const selected = new Set(widget.testimonialIds);
      return {
        widget,
        brand: mapWorkspace(result.workspace),
        testimonials: all
          .filter((item) => item.status === "approved" && (!selected.size || selected.has(item.id)))
          .map(publicTestimonial),
      };
    },

    async publicWall({ wallSlug, workspaceSlug }) {
      const conditions = [eq(walls.status, "published")];
      if (wallSlug) conditions.push(eq(walls.slug, wallSlug));
      if (!wallSlug) conditions.push(eq(walls.isPrimary, true));
      if (workspaceSlug) conditions.push(eq(workspaces.slug, workspaceSlug));
      const [result] = await db
        .select({ wall: walls, workspace: workspaces })
        .from(walls)
        .innerJoin(workspaces, eq(walls.workspaceId, workspaces.id))
        .where(and(...conditions))
        .limit(1);
      if (!result) return null;
      const assets = await loadAssets(result.workspace.id, "wall");
      const wall = assets.find((item) => item.id === result.wall.id);
      const all = await loadTestimonials(result.workspace.id);
      const selected = new Set(wall.testimonialIds);
      return {
        wall,
        brand: mapWorkspace(result.workspace),
        testimonials: all
          .filter((item) => item.status === "approved" && (!selected.size || selected.has(item.id)))
          .map(publicTestimonial),
      };
    },

    async createMedia(userId, fields) {
      const workspace = await requireWorkspace(userId);
      const [asset] = await db
        .insert(mediaAssets)
        .values({ workspaceId: workspace.id, ...fields })
        .returning();
      return asset;
    },

    async createPublicMedia(workspaceId, fields) {
      const [asset] = await db
        .insert(mediaAssets)
        .values({ workspaceId, ...fields })
        .returning();
      return asset;
    },

    async markMediaReady(mediaId) {
      const [asset] = await db
        .update(mediaAssets)
        .set({ status: "ready" })
        .where(eq(mediaAssets.id, mediaId))
        .returning();
      return asset ?? null;
    },

    async mediaByStorageKey(storageKey) {
      const [asset] = await db
        .select()
        .from(mediaAssets)
        .where(eq(mediaAssets.storageKey, storageKey))
        .limit(1);
      return asset ?? null;
    },

    async publicMedia(mediaId) {
      const [asset] = await db
        .select()
        .from(mediaAssets)
        .where(and(eq(mediaAssets.id, mediaId), eq(mediaAssets.status, "ready")))
        .limit(1);
      if (!asset) return null;
      if (asset.kind === "logo") return asset;
      if (!asset.testimonialId) return null;
      const [testimonial] = await db
        .select({ status: testimonials.status })
        .from(testimonials)
        .where(
          and(
            eq(testimonials.id, asset.testimonialId),
            isNull(testimonials.deletedAt)
          )
        )
        .limit(1);
      return testimonial?.status === "approved" ? asset : null;
    },
  };
}
