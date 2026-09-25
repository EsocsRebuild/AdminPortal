import { z } from "zod";

/** Links must be absolute https (or mailto:) so nothing like javascript: gets through. */
export const safeUrl = z
  .string()
  .trim()
  .max(2048)
  .refine((v) => /^https:\/\/[^\s<>"']+$/i.test(v) || /^mailto:[^\s<>"']+$/i.test(v), {
    error: "Use a full web address starting with https://",
  });

const optionalUrl = z.union([z.literal(""), safeUrl]);
const imageUrl = z
  .string()
  .trim()
  .max(2048)
  .refine((v) => /^https:\/\/[^\s<>"']+$/i.test(v), { error: "Use an image address starting with https://" });

const blockId = z.string().regex(/^[a-z0-9-]{4,40}$/i);
const align = z.enum(["left", "center"]);

export const blockSchema = z.discriminatedUnion("type", [
  z.object({
    id: blockId,
    type: z.literal("heading"),
    text: z.string().trim().min(1, { error: "Add heading text." }).max(200),
    align,
  }),
  z.object({
    id: blockId,
    type: z.literal("text"),
    text: z.string().trim().min(1, { error: "Add some text." }).max(5000),
    align,
  }),
  z.object({
    id: blockId,
    type: z.literal("button"),
    label: z.string().trim().min(1, { error: "Add button text." }).max(60),
    url: safeUrl,
    align,
    style: z.enum(["filled", "outline"]),
  }),
  z.object({
    id: blockId,
    type: z.literal("image"),
    src: imageUrl,
    alt: z.string().trim().min(1, { error: "Describe the image for people who can’t see it." }).max(200),
    href: optionalUrl,
    width: z.enum(["full", "medium"]),
  }),
  z.object({ id: blockId, type: z.literal("divider") }),
  z.object({ id: blockId, type: z.literal("spacer"), size: z.enum(["sm", "md", "lg"]) }),
]);

export const emailDocumentSchema = z.object({
  version: z.literal(1),
  settings: z.object({
    accentColor: z.string().regex(/^#[0-9a-f]{6}$/i, { error: "Choose a colour." }),
    background: z.enum(["light", "muted"]),
  }),
  blocks: z.array(blockSchema).max(80, { error: "That’s a very long email. Keep it under 80 blocks." }),
});

/** Looser check used while drafting: structure must be sound, content can be incomplete. */
export const draftDocumentSchema = z.object({
  version: z.literal(1),
  settings: emailDocumentSchema.shape.settings,
  blocks: z
    .array(
      z
        .object({ id: blockId, type: z.enum(["heading", "text", "button", "image", "divider", "spacer"]) })
        .loose(),
    )
    .max(80),
});
