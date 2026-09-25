/**
 * The shape every Server Action returns. Actions never throw to the client:
 * they return a result the UI can render (field errors, a toast, a re-auth prompt).
 */
export type ErrorCode =
  | "VALIDATION"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "REAUTH_REQUIRED"
  | "MFA_REQUIRED"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "UNAVAILABLE"
  | "UNKNOWN";

export type FieldErrors = Record<string, string[] | undefined>;

export type ActionResult<T = void> =
  | { ok: true; data: T; message?: string }
  | { ok: false; code: ErrorCode; message: string; fieldErrors?: FieldErrors };

export const ok = <T>(data: T, message?: string): ActionResult<T> => ({ ok: true, data, message });

export const fail = (code: ErrorCode, message: string, fieldErrors?: FieldErrors): ActionResult<never> => ({
  ok: false,
  code,
  message,
  fieldErrors,
});

/** First error for a field, for inline display. */
export function fieldError(result: ActionResult<unknown> | undefined | null, field: string) {
  return result && !result.ok ? result.fieldErrors?.[field]?.[0] : undefined;
}

/** Standard paginated list returned by the API. */
export interface Page<T> {
  data: T[];
  meta: { page: number; pageSize: number; total: number };
}
