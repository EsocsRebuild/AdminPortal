import { z } from "zod";

export const PAGE_SIZES = [10, 20, 50, 100] as const;

/**
 * Search params shared by every list page. Invalid values fall back to
 * defaults rather than erroring, so a hand-edited URL never breaks a page.
 */
export const listParamsSchema = z.object({
  page: z.coerce.number().int().min(1).max(10_000).catch(1),
  pageSize: z.coerce
    .number()
    .refine((v) => (PAGE_SIZES as readonly number[]).includes(v))
    .catch(20),
  q: z.string().trim().max(120).optional().catch(undefined),
  sort: z
    .string()
    .regex(/^[a-zA-Z][a-zA-Z0-9_.]{0,40}$/)
    .optional()
    .catch(undefined),
  dir: z.enum(["asc", "desc"]).optional().catch(undefined),
});

export type ListParams = z.infer<typeof listParamsSchema>;
export type SearchParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

/** Parse list params plus any page-specific filters. */
export function parseListParams<E extends z.ZodRawShape = Record<never, never>>(
  searchParams: SearchParams,
  extra?: E,
): ListParams & z.infer<z.ZodObject<E>> {
  const flat = Object.fromEntries(Object.entries(searchParams).map(([k, v]) => [k, first(v)]));
  const schema = extra ? listParamsSchema.extend(extra) : listParamsSchema;
  return schema.parse(flat) as ListParams & z.infer<z.ZodObject<E>>;
}

/** A filter param restricted to known values, e.g. `enumParam(["active","pending"])`. */
export const enumParam = <const T extends readonly [string, ...string[]]>(values: T) =>
  z.enum(values).optional().catch(undefined);

export const idParam = z
  .string()
  .regex(/^[A-Za-z0-9_-]{1,64}$/)
  .optional()
  .catch(undefined);
