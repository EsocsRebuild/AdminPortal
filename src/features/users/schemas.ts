import { z } from "zod";

import { permissions } from "@/lib/permissions";

const id = z.string().regex(/^[A-Za-z0-9_-]{1,64}$/);

export const inviteInput = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email({ error: "That email doesn’t look right." })),
  name: z.string().trim().max(120).optional().or(z.literal("")),
  roleId: id,
});
export const changeRoleInput = z.object({ id, roleId: id });
export const userIdInput = z.object({ id });
export const approveInput = z.object({ id, roleId: id });
export const rejectInput = z.object({ id, reason: z.string().trim().max(500).optional() });
export const roleInput = z.object({
  name: z.string().trim().min(2, { error: "Give the role a name." }).max(60),
  description: z.string().trim().max(280).optional().or(z.literal("")),
  permissions: z.array(z.enum(permissions)).max(permissions.length),
});
export const updateRoleInput = z.object({ id, values: roleInput });
