import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { COOKIE } from "@/server/cookies";

import { MfaForm } from "./mfa-form";

export const metadata: Metadata = { title: "Two-step verification" };

export default async function MfaPage({ searchParams }: PageProps<"/mfa">) {
  // Only reachable mid-sign-in.
  if (!(await cookies()).has(COOKIE.mfa)) redirect("/login?reason=expired");
  const { next } = await searchParams;
  return <MfaForm next={typeof next === "string" ? next : undefined} />;
}
