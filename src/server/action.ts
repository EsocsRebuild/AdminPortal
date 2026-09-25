import "server-only";

import { cookies } from "next/headers";
import { unstable_rethrow } from "next/navigation";
import { z } from "zod";

import { can, type Permission } from "@/lib/permissions";
import { fail, ok, type ActionResult } from "@/lib/result";
import type { SessionUser } from "@/types/auth";

import { BackendError, defaultMessage } from "./backend";
import { COOKIE } from "./cookies";
import { getSession } from "./session";

export interface ActionContext {
  user: SessionUser;
  /** Pass to `backend()` for operations the API also guards with sudo mode. */
  sudoHeaders: Record<string, string>;
}

interface Options<S extends z.ZodType> {
  schema: S;
  /** Required permission. Checked on every call, not just when the page rendered. */
  permission?: Permission;
  /** Require a recent password re-entry (delete, send to everyone, role changes…). */
  sudo?: boolean;
}

/**
 * Wraps a Server Action with the checks every mutation needs, in order:
 * session → permission → sudo → input validation → handler → error mapping.
 *
 * Server Actions are public POST endpoints, so nothing here trusts the page
 * that rendered the button.
 */
export function secureAction<S extends z.ZodType, R>(
  options: Options<S>,
  handler: (input: z.output<S>, ctx: ActionContext) => Promise<R>,
) {
  return async (input: z.input<S>): Promise<ActionResult<R>> => {
    try {
      const user = await getSession();
      if (!user) return fail("UNAUTHENTICATED", defaultMessage("UNAUTHENTICATED"));
      if (options.permission && !can(user, options.permission)) {
        return fail("FORBIDDEN", defaultMessage("FORBIDDEN"));
      }

      let sudoHeaders: Record<string, string> = {};
      if (options.sudo) {
        const token = (await cookies()).get(COOKIE.sudo)?.value;
        if (!token) return fail("REAUTH_REQUIRED", defaultMessage("REAUTH_REQUIRED"));
        sudoHeaders = { "X-Sudo-Token": token };
      }

      const parsed = options.schema.safeParse(input);
      if (!parsed.success) return validationFailure(parsed.error);

      return ok(await handler(parsed.data, { user, sudoHeaders }));
    } catch (error) {
      return toFailure(error);
    }
  };
}

/** Same pipeline without a session, for sign-in, sign-up and public forms. */
export function publicAction<S extends z.ZodType, R>(
  options: { schema: S },
  handler: (input: z.output<S>) => Promise<R>,
) {
  return async (input: z.input<S>): Promise<ActionResult<R>> => {
    try {
      const parsed = options.schema.safeParse(input);
      if (!parsed.success) return validationFailure(parsed.error);
      return ok(await handler(parsed.data));
    } catch (error) {
      return toFailure(error);
    }
  };
}

function validationFailure(error: z.ZodError) {
  return fail("VALIDATION", "Please check the highlighted fields.", z.flattenError(error).fieldErrors as Record<string, string[]>);
}

function toFailure(error: unknown): ActionResult<never> {
  // Let redirect(), notFound() and forbidden() through.
  unstable_rethrow(error);
  if (error instanceof BackendError) {
    return fail(error.code, error.message, error.fields);
  }
  // Unexpected: log server-side, never leak details to the browser.
  console.error("[action] unexpected error", error);
  return fail("UNKNOWN", defaultMessage("UNKNOWN"));
}
