"use server";

import { revalidatePath } from "next/cache";

import { publicAction, secureAction } from "@/server/action";
import { backend, BackendError } from "@/server/backend";

import { buildAnswerSchema } from "./answer-schema";
import {
  createFormInput,
  deleteResponsesInput,
  formIdInput,
  publicSubmitInput,
  publishableSchema,
  settingsInput,
  slugInput,
  updateFormInput,
} from "./schemas";
import type { Form, PublicForm } from "./types";

const paths = (id: string) => {
  revalidatePath("/forms");
  revalidatePath(`/forms/${id}`, "layout");
};

export const createForm = secureAction(
  { schema: createFormInput, permission: "forms:manage" },
  async (input) => {
    const f = await backend<Form>("/forms", { method: "POST", body: input });
    revalidatePath("/forms");
    return { id: f.id };
  },
);

export const updateForm = secureAction(
  { schema: updateFormInput, permission: "forms:manage" },
  async ({ id, ...patch }) => {
    await backend(`/forms/${id}`, { method: "PATCH", body: patch });
    return null;
  },
);

export const updateFormSettings = secureAction(
  { schema: settingsInput, permission: "forms:manage" },
  async ({ id, settings }) => {
    await backend(`/forms/${id}/settings`, { method: "PUT", body: settings });
    paths(id);
    return null;
  },
);

export const updateFormSlug = secureAction(
  { schema: slugInput, permission: "forms:manage" },
  async ({ id, slug }) => {
    await backend(`/forms/${id}/slug`, { method: "PUT", body: { slug } });
    paths(id);
    return { slug };
  },
);

export const publishForm = secureAction(
  { schema: formIdInput, permission: "forms:manage" },
  async ({ id }) => {
    const form = await backend<Form>(`/forms/${id}`);
    const check = publishableSchema.safeParse(form);
    if (!check.success)
      throw new BackendError(
        "VALIDATION",
        check.error.issues[0]?.message ?? "This form isn’t ready yet.",
        422,
      );
    await backend(`/forms/${id}/publish`, { method: "POST" });
    paths(id);
    return null;
  },
);

export const closeForm = secureAction({ schema: formIdInput, permission: "forms:manage" }, async ({ id }) => {
  await backend(`/forms/${id}/close`, { method: "POST" });
  paths(id);
  return null;
});

export const duplicateForm = secureAction(
  { schema: formIdInput, permission: "forms:manage" },
  async ({ id }) => {
    const f = await backend<Form>(`/forms/${id}/duplicate`, { method: "POST" });
    revalidatePath("/forms");
    return { id: f.id };
  },
);

/** Deletes the form and every response. Requires re-authentication. */
export const deleteForm = secureAction(
  { schema: formIdInput, permission: "forms:manage", sudo: true },
  async ({ id }, { sudoHeaders }) => {
    await backend(`/forms/${id}`, { method: "DELETE", headers: sudoHeaders });
    revalidatePath("/forms");
    return null;
  },
);

export const deleteResponses = secureAction(
  { schema: deleteResponsesInput, permission: "forms:manage", sudo: true },
  async ({ id, responseIds }, { sudoHeaders }) => {
    const r = await backend<{ deleted: number }>(`/forms/${id}/responses/delete`, {
      method: "POST",
      body: { responseIds },
      headers: sudoHeaders,
    });
    paths(id);
    return r;
  },
);

/**
 * Public submission. Validates answers against the live form definition
 * (not whatever the browser sent about the form), drops unknown keys, and
 * applies basic bot checks before the API's own rate limiting.
 */
export const submitFormResponse = publicAction(
  { schema: publicSubmitInput },
  async ({ slug, answers, website, startedAt, captchaToken }) => {
    if (website) return { ok: true as const }; // Honeypot hit: pretend success, store nothing.
    if (Date.now() - startedAt < 2500)
      throw new BackendError(
        "RATE_LIMITED",
        "That was quick! Please check your answers and submit again.",
        429,
      );

    const form = await backend<PublicForm>(`/public/forms/${slug}`, { auth: false });
    if (form.status !== "published")
      throw new BackendError("CONFLICT", "This form is no longer accepting responses.", 409);

    const parsed = buildAnswerSchema(form.fields).safeParse(answers);
    if (!parsed.success) {
      const fields: Record<string, string[]> = {};
      for (const i of parsed.error.issues) (fields[String(i.path[0])] ??= []).push(i.message);
      throw new BackendError("VALIDATION", "Please check the highlighted answers.", 422, fields);
    }
    await backend(`/public/forms/${slug}/responses`, {
      method: "POST",
      auth: false,
      body: { answers: parsed.data, captchaToken },
    });
    return { ok: true as const };
  },
);
