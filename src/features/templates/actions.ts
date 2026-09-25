"use server";

import { revalidatePath } from "next/cache";

import { secureAction } from "@/server/action";
import { backend } from "@/server/backend";

import { createTemplateInput, templateIdInput, updateTemplateInput } from "./schemas";
import type { Template } from "./types";

export const createTemplate = secureAction(
  { schema: createTemplateInput, permission: "templates:manage" },
  async (input) => {
    const t = await backend<Template>("/templates", { method: "POST", body: input });
    revalidatePath("/templates");
    return { id: t.id };
  },
);

export const updateTemplate = secureAction(
  { schema: updateTemplateInput, permission: "templates:manage" },
  async ({ id, ...patch }) => {
    await backend(`/templates/${id}`, { method: "PATCH", body: patch });
    revalidatePath("/templates");
    return null;
  },
);

export const duplicateTemplate = secureAction(
  { schema: templateIdInput, permission: "templates:manage" },
  async ({ id }) => {
    const t = await backend<Template>(`/templates/${id}/duplicate`, { method: "POST" });
    revalidatePath("/templates");
    return { id: t.id };
  },
);

export const deleteTemplate = secureAction(
  { schema: templateIdInput, permission: "templates:manage" },
  async ({ id }) => {
    await backend(`/templates/${id}`, { method: "DELETE" });
    revalidatePath("/templates");
    return null;
  },
);
