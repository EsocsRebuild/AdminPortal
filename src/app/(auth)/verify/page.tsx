import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { COOKIE } from "@/server/cookies";

import { VerifyForm } from "./verify-form";

export const metadata: Metadata = { title: "Confirm your email" };

/** "ada.okafor@example.com" → "ad••••••r@example.com" */
function mask(email: string) {
  const [user, domain] = email.split("@");
  if (!domain || user.length < 3) return email;
  return `${user.slice(0, 2)}${"•".repeat(Math.min(6, user.length - 3))}${user.slice(-1)}@${domain}`;
}

export default async function VerifyPage() {
  const email = (await cookies()).get(COOKIE.pendingEmail)?.value;
  if (!email) redirect("/login");
  return <VerifyForm maskedEmail={mask(email)} />;
}
