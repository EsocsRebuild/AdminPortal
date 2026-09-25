import { describe, expect, it } from "vitest";

import { buildAnswerSchema } from "./answer-schema";
import type { FormField } from "./types";

const f = (over: Partial<FormField>): FormField => ({
  id: "f1",
  type: "short_text",
  label: "Q",
  description: null,
  placeholder: null,
  required: false,
  options: null,
  validation: null,
  ...over,
});

describe("buildAnswerSchema", () => {
  const schema = buildAnswerSchema([
    f({ id: "name", required: true }),
    f({ id: "email", type: "email" }),
    f({ id: "size", type: "radio", required: true, options: [{ id: "s", label: "S" }, { id: "m", label: "M" }] }),
    f({ id: "age", type: "number", validation: { min: 0, max: 120 } }),
    f({ id: "ok", type: "consent", required: true }),
    f({ id: "intro", type: "section" }),
  ]);

  it("accepts a valid submission", () => {
    expect(schema.safeParse({ name: "Ada", email: "", size: "m", age: "34", ok: true }).success).toBe(true);
  });

  it("rejects missing required answers, unknown options and out-of-range numbers", () => {
    const r = schema.safeParse({ name: "  ", size: "xl", age: "300", ok: false });
    expect(r.success).toBe(false);
    const paths = r.error!.issues.map((i) => i.path[0]);
    expect(paths).toEqual(expect.arrayContaining(["name", "size", "age", "ok"]));
  });

  it("drops fields that aren't on the form", () => {
    const r = schema.parse({ name: "Ada", size: "s", ok: true, injected: "<script>" });
    expect(r).not.toHaveProperty("injected");
  });
});

describe("buildAnswerSchema messages", () => {
  const schema = buildAnswerSchema([
    f({ id: "name", required: true }),
    f({ id: "age", type: "number", required: true }),
    f({ id: "size", type: "radio", required: true, options: [{ id: "s", label: "S" }] }),
  ]);

  it("uses plain language for unanswered questions", () => {
    const r = schema.safeParse({});
    const messages = Object.fromEntries(r.error!.issues.map((i) => [i.path[0], i.message]));
    expect(messages).toEqual({ name: "This question is required.", age: "This question is required.", size: "Choose an option." });
  });

  it("doesn't treat an empty required number as zero", () => {
    expect(schema.safeParse({ name: "Ada", age: "", size: "s" }).success).toBe(false);
    expect(schema.safeParse({ name: "Ada", age: "0", size: "s" }).success).toBe(true);
  });
});
