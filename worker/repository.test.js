import { describe, expect, it } from "vitest";
import { createMemoryRepository } from "./repository.js";

const user = (id) => ({ id, name: id, email: `${id}@halo.test` });

describe("memory repository contracts", () => {
  it("bootstraps one empty workspace with one complete default form", async () => {
    const repository = createMemoryRepository({ seedFixtures: false });
    const data = await repository.bootstrap(user("new-owner"));

    expect(data.testimonials).toEqual([]);
    expect(data.widgets).toEqual([]);
    expect(data.walls).toEqual([]);
    expect(data.forms).toHaveLength(1);
    expect(data.forms[0]).toMatchObject({
      name: "Default collection form",
      status: "active",
      responses: 0,
      config: {
        headline: "Share your experience",
        fields: {
          rating: true,
          role: true,
          company: true,
          website: false,
          avatar: true,
        },
      },
    });
    expect(data.workspace).toEqual(
      expect.objectContaining({
        workspaceName: "My workspace",
        brandColor: "#0071e3",
        logoImage: null,
      })
    );
  });

  it("enforces tenant ownership and globally unique form slugs", async () => {
    const repository = createMemoryRepository({ seedFixtures: false });
    const first = await repository.bootstrap(user("owner-one"));
    await repository.bootstrap(user("owner-two"));

    expect(
      await repository.updateForm("owner-two", first.forms[0].id, {
        name: "Cross-tenant edit",
      })
    ).toBeNull();

    await repository.createForm("owner-one", {
      name: "Launch",
      slug: "globally-unique-launch",
    });
    await expect(
      repository.createForm("owner-two", {
        name: "Launch",
        slug: "globally-unique-launch",
      })
    ).rejects.toMatchObject({ status: 409 });
  });

  it("never exposes pending or rejected proof from a published widget", async () => {
    const repository = createMemoryRepository({ seedFixtures: false });
    const data = await repository.bootstrap(user("moderator"));
    const form = data.forms[0];
    const submitted = await repository.submitPublic(form.slug, {
      name: "Pending Customer",
      text: "A testimonial that must be moderated before publication.",
      role: "Founder",
      company: "Example",
      website: "",
      rating: 5,
      consent: true,
    });
    await repository.saveStudioAsset("moderator", {
      kind: "widget",
      name: "Proof grid",
      slug: "moderation-proof-grid",
      status: "published",
      config: {},
      testimonialIds: [submitted.id],
    });

    expect(
      (await repository.publicWidget("moderation-proof-grid")).testimonials
    ).toEqual([]);

    await repository.updateTestimonial("moderator", submitted.id, {
      status: "approved",
    });
    expect(
      (await repository.publicWidget("moderation-proof-grid")).testimonials
    ).toHaveLength(1);

    await repository.updateTestimonial("moderator", submitted.id, {
      status: "rejected",
    });
    expect(
      (await repository.publicWidget("moderation-proof-grid")).testimonials
    ).toEqual([]);
  });

  it("deletes only owned forms", async () => {
    const repository = createMemoryRepository({ seedFixtures: false });
    const first = await repository.bootstrap(user("delete-one"));
    await repository.bootstrap(user("delete-two"));

    expect(
      await repository.deleteForm("delete-two", first.forms[0].id)
    ).toBe(false);
    expect(
      await repository.deleteForm("delete-one", first.forms[0].id)
    ).toBe(true);
  });
});
