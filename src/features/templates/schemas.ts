import { z } from "zod";

import { draftDocumentSchema } from "@/features/email-builder/schema";

const id = z.string().regex(/^[A-Za-z0-9_-]{1,64}$/);
const name = z.string().trim().min(2, { error: "Give the template a name." }).max(80);

export const createTemplateInput = z.object({ name, content: draftDocumentSchema });
export const updateTemplateInput = z.object({
  id,
  name: name.optional(),
  content: draftDocumentSchema.optional(),
});
export const templateIdInput = z.object({ id });
