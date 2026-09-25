import type { AuthTokens } from "@/server/session";

/** `POST /auth/login` outcome. */
export type LoginResponse =
  | { status: "authenticated"; tokens: AuthTokens }
  | { status: "mfa_required"; challengeToken: string; expiresIn: number }
  | { status: "email_unverified"; email: string };

export interface PublicParish {
  id: string;
  name: string;
}

export interface PublicRole {
  id: string;
  name: string;
  description: string;
  /** Icon key chosen by the API, e.g. "church", "finance", "editor", "viewer". */
  icon: string;
}
