/**
 * Password policy shared by the strength meter and the server-side schema.
 * Length is what matters most (NIST 800-63B); the other hints raise strength.
 * The API should additionally reject passwords found in breach corpora.
 */
export const PASSWORD_MIN = 12;
export const PASSWORD_MAX = 128;

export const passwordRules = [
  {
    id: "length",
    label: `At least ${PASSWORD_MIN} characters`,
    required: true,
    test: (p: string) => p.length >= PASSWORD_MIN,
  },
  { id: "number", label: "A number", required: false, test: (p: string) => /\d/.test(p) },
  {
    id: "case",
    label: "Upper and lower case",
    required: false,
    test: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p),
  },
  {
    id: "symbol",
    label: "A symbol, like ! or #",
    required: false,
    test: (p: string) => /[^A-Za-z0-9\s]/.test(p),
  },
] as const;

/** 0–4. Length is required before any other rule counts. */
export function passwordScore(password: string) {
  if (!passwordRules[0].test(password)) return password.length >= 8 ? 1 : 0;
  return passwordRules.filter((r) => r.test(password)).length;
}
