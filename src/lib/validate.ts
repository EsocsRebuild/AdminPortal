import type { z } from "zod";

import type { ActionResult } from "./result";

export type Errors = Record<string, string | undefined>;

/** First message per field path ("options.0.label"). */
export function issuesToErrors(error: z.ZodError): Errors {
  const out: Errors = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    out[key] ??= issue.message;
  }
  return out;
}

/** Client-side pre-check with the same schema the server uses. */
export function validate<S extends z.ZodType>(schema: S, values: unknown) {
  const parsed = schema.safeParse(values);
  return parsed.success
    ? ({ ok: true, data: parsed.data as z.output<S>, errors: {} as Errors } as const)
    : ({ ok: false, errors: issuesToErrors(parsed.error) } as const);
}

/** Server field errors in the same shape, optionally re-rooted (e.g. "values."). */
export function resultErrors(result: ActionResult<unknown> | null | undefined, stripPrefix = ""): Errors {
  if (!result || result.ok || !result.fieldErrors) return {};
  const out: Errors = {};
  for (const [k, v] of Object.entries(result.fieldErrors)) {
    out[k.startsWith(stripPrefix) ? k.slice(stripPrefix.length) : k] = v?.[0];
  }
  return out;
}
