/** Personalisation tags the API replaces per recipient. */
export const mergeTags = [
  { tag: "{{first_name}}", label: "First name", preview: "Friend" },
  { tag: "{{last_name}}", label: "Last name", preview: "" },
  { tag: "{{email}}", label: "Email address", preview: "name@example.com" },
] as const;

/** Replaces tags with neutral preview values. */
export function previewMergeTags(text: string) {
  return mergeTags.reduce((out, t) => out.replaceAll(t.tag, t.preview), text).replace(/\s{2,}/g, " ");
}

/** Tags the API won't recognise, so authors can fix typos before sending. */
export function unknownTags(text: string) {
  const known = new Set<string>(mergeTags.map((t) => t.tag));
  return [...new Set(text.match(/\{\{[^}]*\}\}/g) ?? [])].filter((t) => !known.has(t));
}
