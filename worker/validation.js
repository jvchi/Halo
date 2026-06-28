import { z } from "zod";

export const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;
export const SAFE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
export const LOGO_MAX_BYTES = 2 * 1024 * 1024;

const slug = z.string().trim().min(2).max(64).regex(SAFE_SLUG);
const recordId = z.string().trim().min(1).max(100);

export const workspacePatchSchema = z
  .object({
    workspaceName: z.string().trim().min(1).max(100).optional(),
    slug: slug.optional(),
    website: z.string().trim().max(300).optional(),
    brandColor: z.string().regex(HEX_COLOR).optional(),
    logoAssetId: z.string().uuid().nullable().optional(),
  })
  .strict();

export const formCreateSchema = z
  .object({
    name: z.string().trim().min(1).max(100),
    slug: slug.optional(),
    status: z.enum(["active", "paused", "archived"]).optional(),
    config: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export const formPatchSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    slug: slug.optional(),
    status: z.enum(["active", "paused", "archived"]).optional(),
    config: z.record(z.string(), z.unknown()).optional(),
  })
  .strict();

export const testimonialCreateSchema = z
  .object({
    formId: recordId.nullable().optional(),
    name: z.string().trim().min(1).max(120),
    text: z.string().trim().min(10).max(4000),
    role: z.string().trim().max(120).default(""),
    company: z.string().trim().max(120).default(""),
    website: z.string().trim().max(300).default(""),
    rating: z.number().int().min(0).max(5).default(0),
    source: z.string().trim().max(40).default("manual"),
    sourceUrl: z.string().trim().max(500).default(""),
    status: z.enum(["pending", "approved", "rejected", "archived"]).default("pending"),
    tags: z.array(z.string().trim().min(1).max(60)).max(20).default([]),
    consentStatus: z.enum(["granted", "unknown", "revoked"]).default("unknown"),
    consentText: z.string().max(500).default(""),
    avatarStorageKey: z.string().max(300).nullable().optional(),
  })
  .strict();

export const publicSubmissionSchema = testimonialCreateSchema
  .pick({
    name: true,
    text: true,
    role: true,
    company: true,
    website: true,
    rating: true,
    avatarStorageKey: true,
  })
  .extend({
    consent: z.literal(true),
    honeypot: z.string().max(200).optional().default(""),
  })
  .strict();

export const testimonialPatchSchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    text: z.string().trim().min(1).max(4000).optional(),
    role: z.string().trim().max(120).optional(),
    company: z.string().trim().max(120).optional(),
    rating: z.number().int().min(0).max(5).optional(),
    source: z.string().trim().max(40).optional(),
    status: z.enum(["pending", "approved", "rejected", "archived"]).optional(),
    tags: z.array(z.string().trim().min(1).max(60)).max(20).optional(),
  })
  .strict();

export const uploadRequestSchema = z
  .object({
    fileName: z.string().trim().min(1).max(180),
    mimeType: z.enum(IMAGE_MIME_TYPES),
    sizeBytes: z.number().int().positive(),
    kind: z.enum(["avatar", "logo"]),
  })
  .strict();

export const studioAssetSchema = z
  .object({
    id: recordId.optional(),
    kind: z.enum(["widget", "wall"]),
    name: z.string().trim().min(1).max(120),
    slug: slug,
    status: z.enum(["draft", "published", "archived"]).default("draft"),
    folderId: recordId.nullable().optional(),
    config: z.record(z.string(), z.unknown()),
    testimonialIds: z.array(recordId).max(100).default([]),
    isPrimary: z.boolean().optional(),
  })
  .strict();

export const folderCreateSchema = z.object({ name: z.string().trim().min(1).max(80) }).strict();

export function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function parse(schema, value) {
  const parsed = schema.safeParse(value);
  return parsed.success
    ? { data: parsed.data, error: null }
    : { data: null, error: parsed.error.issues.map((issue) => issue.message).join(" ") };
}
