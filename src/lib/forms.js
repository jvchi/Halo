// Mock collection-forms seed. The shape mirrors the `collection_forms` table in
// docs/PRODUCT_BUILD_BLUEPRINT.md §10 plus the form `config` from §6.3, trimmed
// to the fields the builder touches. The Forms list and Form Builder mutate this
// via the store; when a backend exists this fixture is swapped for real fetches
// and the public `/submit/{slug}` route renders the same `config`.

export const FORM_STATUSES = ["active", "paused", "archived"];

// Which optional fields a form collects. Name + testimonial text are always on.
export function defaultFields() {
  return { rating: true, role: true, company: true, website: false, avatar: true };
}

export function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

let seq = 0;
const nextId = () =>
  globalThis.crypto?.randomUUID?.() ?? `f-${Date.now().toString(36)}-${seq++}`;

export function createForm(overrides = {}) {
  const name = overrides.name ?? "Untitled form";
  return {
    id: nextId(),
    name,
    slug: overrides.slug ?? (slugify(name) || "untitled-form"),
    status: "active",
    responses: 0,
    config: {
      headline: "Share your experience",
      description: "We'd love to hear how it's going. It only takes a minute.",
      prompt: "What do you like most, and who would you recommend it to?",
      fields: defaultFields(),
      requireConsent: true,
      consentText: "I agree that my testimonial may be published publicly.",
      thankYou: "Thank you — your words mean a lot to us.",
      ...overrides.config,
    },
    ...overrides,
  };
}

export const sampleForms = [
  {
    id: "f-default",
    name: "Default collection form",
    slug: "share-your-story",
    status: "active",
    responses: 42,
    config: {
      headline: "Share your experience with Halo",
      description:
        "We'd love to hear how Halo has helped you. It only takes about a minute.",
      prompt: "What do you love most about using Halo?",
      fields: { rating: true, role: true, company: true, website: false, avatar: true },
      requireConsent: true,
      consentText: "I agree that my testimonial may be published publicly on Halo.",
      thankYou: "Thank you! Your testimonial means a lot to the whole team.",
    },
  },
  {
    id: "f-launch",
    name: "Launch week feedback",
    slug: "launch-week",
    status: "active",
    responses: 17,
    config: {
      headline: "How was launch week?",
      description: "Tell us what stood out — the good and the could-be-better.",
      prompt: "What was the highlight of using Halo during launch?",
      fields: { rating: true, role: false, company: true, website: false, avatar: true },
      requireConsent: true,
      consentText: "I agree that my testimonial may be published publicly.",
      thankYou: "Appreciate it — see you after launch.",
    },
  },
  {
    id: "f-course",
    name: "Course graduate stories",
    slug: "course-stories",
    status: "paused",
    responses: 8,
    config: {
      headline: "Tell future students your story",
      description: "Your words help the next cohort decide to join.",
      prompt: "What changed for you after the course?",
      fields: { rating: false, role: true, company: false, website: true, avatar: true },
      requireConsent: true,
      consentText: "I agree that my story may be shared on the course page.",
      thankYou: "Thank you for sharing your story.",
    },
  },
];
