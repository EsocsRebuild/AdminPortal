import "server-only";

import { notFound } from "next/navigation";

import { BackendError } from "./backend";

/** Await a read; an API 404 renders the portal's not-found page. */
export async function findOrNotFound<T>(promise: Promise<T>): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    if (error instanceof BackendError && (error.code === "NOT_FOUND" || error.status === 404)) notFound();
    throw error;
  }
}

/** Validates a route id before it's put into an API path. */
export function assertId(id: string) {
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) notFound();
  return id;
}
