import { createForm, sampleForms } from "../src/lib/forms.js";
import { sampleTestimonials } from "../src/lib/testimonials.js";

export const DEFAULT_BRAND = {
  workspaceName: "Halo",
  slug: "halo",
  website: "halo.app",
  brandColor: "#0071e3",
  logoImage: null,
  logoAssetId: null,
};

export function defaultCollectionForm(overrides = {}) {
  const base = createForm({
    name: "Default collection form",
    slug: "share-your-story",
    responses: 0,
  });
  return {
    ...base,
    ...overrides,
    config: {
      ...base.config,
      ...(overrides.config ?? {}),
      fields: {
        ...base.config.fields,
        ...(overrides.config?.fields ?? {}),
      },
    },
  };
}

export function developmentFixtures() {
  return {
    workspace: {
      id: "workspace-development",
      ...DEFAULT_BRAND,
    },
    forms: structuredClone(sampleForms),
    testimonials: structuredClone(sampleTestimonials),
    folders: [{ id: "folder-launch", name: "Launch assets", createdAt: new Date().toISOString() }],
    widgets: [],
    walls: [],
  };
}

export function emptyAccountFixtures(userId) {
  const suffix = userId.replace(/[^a-z0-9]/gi, "").slice(-8).toLowerCase() || "workspace";
  const workspaceName = "My workspace";
  return {
    workspace: {
      id: crypto.randomUUID(),
      workspaceName,
      slug: `workspace-${suffix}`,
      website: "",
      brandColor: "#0071e3",
      logoImage: null,
      logoAssetId: null,
    },
    forms: [
      defaultCollectionForm({
        id: crypto.randomUUID(),
        slug: `share-your-story-${suffix}`,
      }),
    ],
    testimonials: [],
    folders: [],
    widgets: [],
    walls: [],
  };
}

export function publicTestimonial(testimonial) {
  return {
    id: testimonial.id,
    name: testimonial.name,
    role: testimonial.role || "",
    company: testimonial.company || "",
    rating: testimonial.rating || 0,
    source: testimonial.source || "form",
    text: testimonial.text,
    avatarUrl: testimonial.avatarUrl || null,
  };
}

export function uniqueSlug(base, occupied) {
  const safeBase = base || "untitled";
  let candidate = safeBase;
  let counter = 2;
  while (occupied.has(candidate)) {
    candidate = `${safeBase}-${counter}`;
    counter += 1;
  }
  return candidate;
}
