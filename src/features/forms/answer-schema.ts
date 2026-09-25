import { z } from "zod";

import type { FormField } from "./types";

/**
 * Builds the answer validator for a form from its fields. The same schema
 * runs in the visitor's browser (instant feedback) and in the Server Action
 * (authoritative), and the API validates again on its side.
 */
export function buildAnswerSchema(fields: FormField[]) {
  const shape: Record<string, z.ZodType> = {};
  for (const f of fields) {
    if (f.type === "section") continue;
    const req = (s: z.ZodType) => (f.required ? s : s.optional().nullable());
    const text = (max: number) => {
      const base = z.string().trim().max(f.validation?.maxLength ?? max, { error: `Keep this under ${f.validation?.maxLength ?? max} characters.` });
      return f.required ? base.min(1, { error: "This question is required." }) : base.transform((v) => v || null);
    };
    const optionIds = (f.options ?? []).map((o) => o.id);

    switch (f.type) {
      case "short_text":
        shape[f.id] = req(text(300));
        break;
      case "long_text":
        shape[f.id] = req(text(5000));
        break;
      case "email":
        shape[f.id] = f.required
          ? z.string().trim().pipe(z.email({ error: "Enter a valid email address." }))
          : z.union([z.literal(""), z.string().trim().pipe(z.email({ error: "Enter a valid email address." }))]).transform((v) => v || null).optional();
        break;
      case "phone": {
        const phone = z.string().trim().regex(/^[+\d][\d\s()-]{6,24}$/, { error: "Enter a valid phone number." });
        shape[f.id] = f.required ? phone : z.union([z.literal(""), phone]).transform((v) => v || null).optional();
        break;
      }
      case "number": {
        let n = z.coerce.number({ error: "Enter a number." });
        if (f.validation?.min != null) n = n.min(f.validation.min, { error: `Must be ${f.validation.min} or more.` });
        if (f.validation?.max != null) n = n.max(f.validation.max, { error: `Must be ${f.validation.max} or less.` });
        shape[f.id] = f.required ? n : z.union([z.literal(""), n]).transform((v) => (v === "" ? null : v)).optional();
        break;
      }
      case "date": {
        const d = z.iso.date({ error: "Enter a valid date." });
        shape[f.id] = f.required ? d : z.union([z.literal(""), d]).transform((v) => v || null).optional();
        break;
      }
      case "select":
      case "radio": {
        const choice = z.string().refine((v) => optionIds.includes(v), { error: "Choose one of the options." });
        shape[f.id] = f.required ? choice : z.union([z.literal(""), choice]).transform((v) => v || null).optional();
        break;
      }
      case "checkboxes": {
        const arr = z.array(z.string().refine((v) => optionIds.includes(v))).max(optionIds.length);
        shape[f.id] = f.required ? arr.min(1, { error: "Choose at least one option." }) : arr.optional();
        break;
      }
      case "consent":
        shape[f.id] = f.required ? z.literal(true, { error: "Please tick this box to continue." }) : z.boolean().optional();
        break;
    }
  }
  return z.object(shape);
}
