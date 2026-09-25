import type { Answer, FormField } from "./types";

/** Human-readable answer, using option labels for choice questions. */
export function formatAnswer(field: FormField, value: Answer | undefined): string {
  if (value === null || value === undefined || value === "") return "";
  const label = (id: string) => field.options?.find((o) => o.id === id)?.label ?? id;
  if (Array.isArray(value)) return value.map(label).join(", ");
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (field.type === "select" || field.type === "radio") return label(String(value));
  return String(value);
}
