import "server-only";

import { cookies, headers } from "next/headers";

import type { ErrorCode, FieldErrors } from "@/lib/result";

import { COOKIE } from "./cookies";
import { env } from "./env";

/**
 * Server-to-server client for the REST API.
 *
 * - Runs only on the server; the access token is read from the httpOnly cookie.
 * - Forwards the caller's IP, user agent and a request id so the API can rate
 *   limit, audit and trace every call.
 * - Normalises every failure into a `BackendError` with a stable `code`.
 *
 * API conventions (see docs/api-contract.md):
 *   success → `{ "data": … }` (lists add `"meta": { page, pageSize, total }`)
 *   failure → `{ "error": { "code", "message", "fields"? } }`
 */

export class BackendError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public status: number,
    public fields?: FieldErrors,
  ) {
    super(message);
    this.name = "BackendError";
  }
}

const statusToCode: Record<number, ErrorCode> = {
  400: "VALIDATION",
  401: "UNAUTHENTICATED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  422: "VALIDATION",
  429: "RATE_LIMITED",
};

type Query = Record<string, string | number | boolean | null | undefined | (string | number)[]>;

export interface BackendOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Query;
  /** Send the signed-in user's token. Default true. */
  auth?: boolean;
  /** Extra headers, e.g. the sudo token for dangerous operations. */
  headers?: Record<string, string>;
  timeoutMs?: number;
}

export function buildQuery(query?: Query) {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    if (Array.isArray(value)) value.forEach((v) => params.append(key, String(v)));
    else params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

async function forwardedHeaders() {
  const h = await headers();
  const out: Record<string, string> = {
    "X-Request-Id": h.get("x-request-id") ?? crypto.randomUUID(),
  };
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? h.get("x-real-ip");
  if (ip) out["X-Forwarded-For"] = ip;
  const ua = h.get("user-agent");
  if (ua) out["User-Agent"] = ua;
  return out;
}

/** Raw call returning the parsed JSON body (envelope included). */
export async function backendRaw<T>(path: string, options: BackendOptions = {}): Promise<T> {
  const { method = "GET", body, query, auth = true, timeoutMs = 15_000 } = options;
  const url = `${env().BACKEND_API_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}${buildQuery(query)}`;

  const requestHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(await forwardedHeaders()),
    ...options.headers,
  };
  if (body !== undefined) requestHeaders["Content-Type"] = "application/json";
  if (auth) {
    const token = (await cookies()).get(COOKIE.access)?.value;
    if (!token)
      throw new BackendError("UNAUTHENTICATED", "Your session has ended. Please sign in again.", 401);
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(timeoutMs),
      cache: "no-store",
    });
  } catch (cause) {
    const timedOut = cause instanceof DOMException && cause.name === "TimeoutError";
    throw new BackendError(
      "UNAVAILABLE",
      timedOut ? "The server took too long to respond. Please try again." : "We couldn’t reach the server.",
      503,
    );
  }

  if (res.status === 204) return undefined as T;
  const payload = (await res.json().catch(() => null)) as {
    error?: { code?: string; message?: string; fields?: FieldErrors };
  } | null;

  if (!res.ok) {
    const e = payload?.error;
    const code =
      (e?.code as ErrorCode | undefined) ??
      statusToCode[res.status] ??
      (res.status >= 500 ? "UNAVAILABLE" : "UNKNOWN");
    throw new BackendError(code, e?.message ?? defaultMessage(code), res.status, e?.fields);
  }
  return payload as T;
}

/** Call that unwraps `{ data }`. */
export async function backend<T>(path: string, options?: BackendOptions): Promise<T> {
  const payload = await backendRaw<{ data: T }>(path, options);
  return payload?.data as T;
}

export function defaultMessage(code: ErrorCode) {
  switch (code) {
    case "UNAUTHENTICATED":
      return "Your session has ended. Please sign in again.";
    case "FORBIDDEN":
      return "You don’t have permission to do that.";
    case "NOT_FOUND":
      return "We couldn’t find what you were looking for.";
    case "RATE_LIMITED":
      return "Too many attempts. Please wait a moment and try again.";
    case "UNAVAILABLE":
      return "The service is temporarily unavailable. Please try again shortly.";
    case "REAUTH_REQUIRED":
      return "Please confirm your password to continue.";
    default:
      return "Something went wrong. Please try again.";
  }
}

/**
 * Pass-through for file downloads (CSV exports). Returns the API response
 * so a Route Handler can stream it to the browser unchanged.
 */
export async function backendStream(path: string, query?: Query) {
  const token = (await cookies()).get(COOKIE.access)?.value;
  if (!token) throw new BackendError("UNAUTHENTICATED", defaultMessage("UNAUTHENTICATED"), 401);
  const url = `${env().BACKEND_API_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}${buildQuery(query)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, ...(await forwardedHeaders()) },
    signal: AbortSignal.timeout(120_000),
    cache: "no-store",
  }).catch(() => null);
  if (!res) throw new BackendError("UNAVAILABLE", defaultMessage("UNAVAILABLE"), 503);
  if (!res.ok) {
    const code = statusToCode[res.status] ?? "UNKNOWN";
    throw new BackendError(code, defaultMessage(code), res.status);
  }
  return res;
}
