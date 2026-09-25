import { z } from "zod";

const id = z.string().regex(/^[A-Za-z0-9_-]{1,64}$/);
const email = z.string().trim().toLowerCase().pipe(z.email({ error: "That email doesn’t look right." }));
const name = z.string().trim().max(80).optional().or(z.literal("")).transform((v) => v || null);

export const listInput = z.object({
  name: z.string().trim().min(2, { error: "Give this audience a name." }).max(80),
  description: z.string().trim().max(280).optional().or(z.literal("")).transform((v) => v || null),
  doubleOptIn: z.boolean().default(true),
});

export const updateListInput = z.object({ id, values: listInput });
export const listIdInput = z.object({ id });

/** Consent is an explicit attestation, recorded with the request for compliance. */
const consent = z.literal(true, { error: "Please confirm these people agreed to hear from you." });

export const addContactInput = z.object({ listId: id, email, firstName: name, lastName: name, consent });

export const importChunkInput = z.object({
  listId: id,
  contacts: z
    .array(z.object({ email, firstName: name, lastName: name }))
    .min(1)
    .max(500),
  consent,
  updateExisting: z.boolean().default(false),
});

export const addMembersInput = z.object({ listId: id, parishId: id.optional() });

export const removeContactsInput = z.object({ listId: id, ids: z.array(id).min(1).max(500) });
