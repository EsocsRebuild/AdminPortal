import "server-only";

import { z } from "zod";

const schema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  BACKEND_API_URL: z.url({ error: "BACKEND_API_URL must be a full URL, e.g. https://api.esocs.org/v1" }),
  NEXT_PUBLIC_APP_URL: z.url().default("http://localhost:3001"),
  ENABLE_DESIGN_SYSTEM: z
    .enum(["true", "false"])
    .default("false")
    .transform((v) => v === "true"),
});

let cached: z.infer<typeof schema> | undefined;

/** Validated server environment. Throws a readable error on misconfiguration. */
export function env() {
  if (cached) return cached;
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  • ${i.path.join(".")}: ${i.message}`).join("\n");
    throw new Error(`Invalid environment configuration:\n${issues}\nSee .env.example.`);
  }
  cached = parsed.data;
  return cached;
}

export const isProduction = () => env().NODE_ENV === "production";
