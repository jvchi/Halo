import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

export const workspaceRole = pgEnum("workspace_role", ["owner", "admin", "editor", "viewer"]);
export const formStatus = pgEnum("form_status", ["active", "paused", "archived"]);
export const testimonialStatus = pgEnum("testimonial_status", [
  "pending",
  "approved",
  "rejected",
  "archived",
]);
export const consentStatus = pgEnum("consent_status", ["granted", "unknown", "revoked"]);
export const mediaStatus = pgEnum("media_status", ["uploaded", "ready", "failed"]);
export const mediaKind = pgEnum("media_kind", ["avatar", "logo", "image"]);
export const publishStatus = pgEnum("publish_status", ["draft", "published", "archived"]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().default(""),
  name: text("name").notNull().default(""),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const workspaces = pgTable(
  "workspaces",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    websiteUrl: text("website_url").notNull().default(""),
    logoAssetId: uuid("logo_asset_id"),
    brandColor: text("brand_color").notNull().default("#0071e3"),
    plan: text("plan").notNull().default("free"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("workspaces_slug_unique").on(table.slug)]
);

export const workspaceMembers = pgTable(
  "workspace_members",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: workspaceRole("role").notNull().default("owner"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("workspace_members_workspace_user_unique").on(table.workspaceId, table.userId),
    uniqueIndex("workspace_members_user_unique").on(table.userId),
  ]
);

export const collectionForms = pgTable(
  "collection_forms",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    status: formStatus("status").notNull().default("active"),
    config: jsonb("config").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("collection_forms_slug_unique").on(table.slug),
    index("collection_forms_workspace_idx").on(table.workspaceId),
  ]
);

export const testimonials = pgTable(
  "testimonials",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    formId: uuid("form_id").references(() => collectionForms.id, { onDelete: "set null" }),
    status: testimonialStatus("status").notNull().default("pending"),
    mediaType: text("media_type").notNull().default("text"),
    originalContent: text("original_content").notNull(),
    displayContent: text("display_content").notNull(),
    rating: integer("rating"),
    customerName: text("customer_name").notNull(),
    customerRole: text("customer_role").notNull().default(""),
    customerCompany: text("customer_company").notNull().default(""),
    customerWebsite: text("customer_website").notNull().default(""),
    sourceType: text("source_type").notNull().default("form"),
    sourceUrl: text("source_url").notNull().default(""),
    sourceLabel: text("source_label").notNull().default(""),
    consentStatus: consentStatus("consent_status").notNull().default("unknown"),
    consentText: text("consent_text").notNull().default(""),
    consentGrantedAt: timestamp("consent_granted_at", { withTimezone: true }),
    metadata: jsonb("metadata").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("testimonials_workspace_status_idx").on(table.workspaceId, table.status),
    index("testimonials_form_idx").on(table.formId),
    check(
      "testimonials_rating_range",
      sql`${table.rating} is null or (${table.rating} >= 1 and ${table.rating} <= 5)`
    ),
  ]
);

export const mediaAssets = pgTable(
  "media_assets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    testimonialId: uuid("testimonial_id").references(() => testimonials.id, {
      onDelete: "cascade",
    }),
    kind: mediaKind("kind").notNull(),
    storageKey: text("storage_key").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    status: mediaStatus("status").notNull().default("uploaded"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("media_assets_storage_key_unique").on(table.storageKey),
    index("media_assets_testimonial_idx").on(table.testimonialId),
  ]
);

export const tags = pgTable(
  "tags",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    color: text("color").notNull().default("#86868b"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("tags_workspace_name_unique").on(table.workspaceId, table.name)]
);

export const testimonialTags = pgTable(
  "testimonial_tags",
  {
    testimonialId: uuid("testimonial_id")
      .notNull()
      .references(() => testimonials.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => [primaryKey({ columns: [table.testimonialId, table.tagId] })]
);

export const studioFolders = pgTable(
  "studio_folders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("studio_folders_workspace_name_unique").on(table.workspaceId, table.name)]
);

export const widgets = pgTable(
  "widgets",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    folderId: uuid("folder_id").references(() => studioFolders.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    type: text("type").notNull().default("grid"),
    status: publishStatus("status").notNull().default("draft"),
    config: jsonb("config").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("widgets_slug_unique").on(table.slug),
    index("widgets_workspace_idx").on(table.workspaceId),
  ]
);

export const widgetTestimonials = pgTable(
  "widget_testimonials",
  {
    widgetId: uuid("widget_id")
      .notNull()
      .references(() => widgets.id, { onDelete: "cascade" }),
    testimonialId: uuid("testimonial_id")
      .notNull()
      .references(() => testimonials.id, { onDelete: "cascade" }),
    position: integer("position").notNull().default(0),
  },
  (table) => [primaryKey({ columns: [table.widgetId, table.testimonialId] })]
);

export const walls = pgTable(
  "walls",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    workspaceId: uuid("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    folderId: uuid("folder_id").references(() => studioFolders.id, { onDelete: "set null" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    status: publishStatus("status").notNull().default("draft"),
    isPrimary: boolean("is_primary").notNull().default(false),
    config: jsonb("config").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("walls_slug_unique").on(table.slug),
    index("walls_workspace_idx").on(table.workspaceId),
  ]
);

export const wallTestimonials = pgTable(
  "wall_testimonials",
  {
    wallId: uuid("wall_id")
      .notNull()
      .references(() => walls.id, { onDelete: "cascade" }),
    testimonialId: uuid("testimonial_id")
      .notNull()
      .references(() => testimonials.id, { onDelete: "cascade" }),
    position: integer("position").notNull().default(0),
  },
  (table) => [primaryKey({ columns: [table.wallId, table.testimonialId] })]
);
