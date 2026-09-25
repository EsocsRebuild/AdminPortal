"use server";

import { revalidatePath } from "next/cache";

import { secureAction } from "@/server/action";
import { backend } from "@/server/backend";

import {
  addContactInput,
  addMembersInput,
  importChunkInput,
  listIdInput,
  listInput,
  removeContactsInput,
  updateListInput,
} from "./schemas";
import type { AudienceList, ImportResult } from "./types";

export const createAudience = secureAction(
  { schema: listInput, permission: "audiences:manage" },
  async (values) => {
    const list = await backend<AudienceList>("/audiences", { method: "POST", body: values });
    revalidatePath("/audiences");
    return { id: list.id };
  },
);

export const updateAudience = secureAction(
  { schema: updateListInput, permission: "audiences:manage" },
  async ({ id, values }) => {
    await backend(`/audiences/${id}`, { method: "PATCH", body: values });
    revalidatePath("/audiences");
    revalidatePath(`/audiences/${id}`);
    return null;
  },
);

export const deleteAudience = secureAction(
  { schema: listIdInput, permission: "audiences:manage", sudo: true },
  async ({ id }, { sudoHeaders }) => {
    await backend(`/audiences/${id}`, { method: "DELETE", headers: sudoHeaders });
    revalidatePath("/audiences");
    return null;
  },
);

export const addContact = secureAction(
  { schema: addContactInput, permission: "audiences:manage" },
  async (input) => {
    const { listId, ...contact } = input;
    await backend(`/audiences/${listId}/contacts`, { method: "POST", body: contact });
    revalidatePath(`/audiences/${listId}`);
    return null;
  },
);

/** One chunk of a CSV import. The dialog sends chunks in sequence and totals the results. */
export const importContacts = secureAction(
  { schema: importChunkInput, permission: "audiences:manage" },
  async ({ listId, ...body }) => {
    const res = await backend<ImportResult>(`/audiences/${listId}/imports`, { method: "POST", body });
    revalidatePath(`/audiences/${listId}`);
    return res;
  },
);

/** Adds every member (optionally one parish) who has agreed to email updates. */
export const addMembersToAudience = secureAction(
  { schema: addMembersInput, permission: "audiences:manage" },
  async ({ listId, parishId }) => {
    const res = await backend<ImportResult>(`/audiences/${listId}/sync-members`, {
      method: "POST",
      body: { parishId },
    });
    revalidatePath(`/audiences/${listId}`);
    return res;
  },
);

export const removeContacts = secureAction(
  { schema: removeContactsInput, permission: "audiences:manage" },
  async ({ listId, ids }) => {
    const res = await backend<{ removed: number }>(`/audiences/${listId}/contacts/remove`, {
      method: "POST",
      body: { ids },
    });
    revalidatePath(`/audiences/${listId}`);
    return res;
  },
);
