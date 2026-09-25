"use client";

import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import { useOptionalModals } from "@/components/modals/modal-provider";
import { toast } from "@/components/ui/toaster";
import { fieldError, type ActionResult } from "@/lib/result";

interface Options<R> {
  /** Toast shown on success. */
  success?: string | ((data: R) => string);
  /** Called after a successful run. */
  onSuccess?: (data: R) => void;
  /** Skip the automatic error toast (e.g. the form shows the error inline). */
  quiet?: boolean;
}

/**
 * Runs a Server Action with the portal's standard behaviour:
 * - `REAUTH_REQUIRED` → asks for the password, then retries once.
 * - `UNAUTHENTICATED` → back to sign-in, returning here afterwards.
 * - other failures → an error toast (validation errors stay inline).
 */
export function useAction<I, R>(action: (input: I) => Promise<ActionResult<R>>, options: Options<R> = {}) {
  const modals = useOptionalModals();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, setPending] = React.useState(false);
  const [result, setResult] = React.useState<ActionResult<R> | null>(null);
  const optionsRef = React.useRef(options);
  React.useEffect(() => {
    optionsRef.current = options;
  });

  const run = React.useCallback(
    async (input: I): Promise<ActionResult<R>> => {
      const opts = optionsRef.current;
      setPending(true);
      try {
        let res = await action(input);
        if (!res.ok && res.code === "REAUTH_REQUIRED" && modals && (await modals.reauth())) {
          res = await action(input);
        }
        setResult(res);
        if (res.ok) {
          const message = typeof opts.success === "function" ? opts.success(res.data) : opts.success;
          if (message) toast.success(message);
          opts.onSuccess?.(res.data);
        } else if (res.code === "UNAUTHENTICATED") {
          toast.error(res.message);
          router.replace(`/login?next=${encodeURIComponent(pathname)}`);
        } else if (res.code !== "VALIDATION" && res.code !== "REAUTH_REQUIRED" && !opts.quiet) {
          toast.error(res.message);
        }
        return res;
      } finally {
        setPending(false);
      }
    },
    [action, modals, router, pathname],
  );

  const reset = React.useCallback(() => setResult(null), []);
  const errorFor = React.useCallback((field: string) => fieldError(result, field), [result]);

  return { run, pending, result, reset, errorFor };
}
