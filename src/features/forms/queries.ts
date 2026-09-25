import "server-only";

import type { ListParams } from "@/lib/list-params";
import type { Page } from "@/lib/result";
import { backend, backendRaw } from "@/server/backend";
import { env } from "@/server/env";
import { requirePermission } from "@/server/session";

import type { Form, FormResponse, FormStatus, FormSummary, PublicForm } from "./types";

export async function listForms(params: ListParams & { status?: FormStatus }) {
  await requirePermission("forms:view");
  return backendRaw<Page<FormSummary>>("/forms", { query: { ...params } });
}

export async function getForm(id: string) {
  await requirePermission("forms:view");
  return backend<Form>(`/forms/${id}`);
}

export async function listResponses(id: string, params: ListParams) {
  await requirePermission("forms:view");
  return backendRaw<Page<FormResponse>>(`/forms/${id}/responses`, { query: { ...params } });
}

/** Public, unauthenticated. Only published or closed forms are returned by the API. */
export async function getPublicForm(slug: string) {
  return backend<PublicForm>(`/public/forms/${encodeURIComponent(slug)}`, { auth: false });
}

export function publicFormUrl(slug: string) {
  return `${env().NEXT_PUBLIC_APP_URL.replace(/\/$/, "")}/f/${slug}`;
}
