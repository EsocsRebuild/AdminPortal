"use server";

import { revalidatePath } from "next/cache";

import { secureAction } from "@/server/action";
import { backend } from "@/server/backend";

import { bulkDeleteInput, bulkMembersInput, memberIdInput, memberInput, updateMemberInput } from "./schemas";
import type { Member } from "./types";

export const createMember = secureAction(
  { schema: memberInput, permission: "members:manage" },
  async (values) => {
    const member = await backend<Member>("/members", { method: "POST", body: values });
    revalidatePath("/members");
    return { id: member.id, name: `${member.firstName} ${member.lastName}` };
  },
);

export const updateMember = secureAction(
  { schema: updateMemberInput, permission: "members:manage" },
  async ({ id, values }) => {
    await backend<Member>(`/members/${id}`, { method: "PATCH", body: values });
    revalidatePath("/members");
    revalidatePath(`/members/${id}`);
    return null;
  },
);

export const bulkUpdateMembers = secureAction(
  { schema: bulkMembersInput, permission: "members:manage" },
  async ({ ids, action }) => {
    const res = await backend<{ updated: number }>("/members/bulk", {
      method: "POST",
      body: { ids, action },
    });
    revalidatePath("/members");
    return res;
  },
);

/** Permanent. Requires a recent password confirmation. */
export const deleteMember = secureAction(
  { schema: memberIdInput, permission: "members:manage", sudo: true },
  async ({ id }, { sudoHeaders }) => {
    await backend(`/members/${id}`, { method: "DELETE", headers: sudoHeaders });
    revalidatePath("/members");
    return null;
  },
);

export const bulkDeleteMembers = secureAction(
  { schema: bulkDeleteInput, permission: "members:manage", sudo: true },
  async ({ ids }, { sudoHeaders }) => {
    const res = await backend<{ deleted: number }>("/members/bulk-delete", {
      method: "POST",
      body: { ids },
      headers: sudoHeaders,
    });
    revalidatePath("/members");
    return res;
  },
);
