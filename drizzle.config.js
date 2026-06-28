import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./worker/db/schema.js",
  out: "./drizzle",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgresql://drizzle:drizzle@localhost:5432/halo",
  },
  strict: true,
  verbose: true,
});
