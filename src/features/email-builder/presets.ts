import type { Block, EmailDocument } from "./types";

export const newId = () => Math.random().toString(36).slice(2, 10);

export function newBlock(type: Block["type"]): Block {
  const id = newId();
  switch (type) {
    case "heading":
      return { id, type, text: "", align: "left" };
    case "text":
      return { id, type, text: "", align: "left" };
    case "button":
      return { id, type, label: "Learn more", url: "", align: "left", style: "filled" };
    case "image":
      return { id, type, src: "", alt: "", href: "", width: "full" };
    case "divider":
      return { id, type };
    case "spacer":
      return { id, type, size: "md" };
  }
}

const doc = (blocks: Block[]): EmailDocument => ({
  version: 1,
  settings: { accentColor: "#2f4fb4", background: "muted" },
  blocks,
});

/**
 * Starting layouts. The text is guidance for the author, not sample content,
 * and every block is editable.
 */
export const presets: { id: string; name: string; description: string; build: () => EmailDocument }[] = [
  { id: "blank", name: "Blank", description: "Start from nothing.", build: () => doc([]) },
  {
    id: "announcement",
    name: "Announcement",
    description: "One clear message and a button.",
    build: () =>
      doc([
        { id: newId(), type: "heading", text: "Your headline", align: "left" },
        {
          id: newId(),
          type: "text",
          text: "Dear {{first_name}},\n\nWrite your message here. Keep it short and friendly.",
          align: "left",
        },
        { id: newId(), type: "button", label: "Find out more", url: "", align: "left", style: "filled" },
      ]),
  },
  {
    id: "newsletter",
    name: "Newsletter",
    description: "A few short updates, separated by lines.",
    build: () =>
      doc([
        { id: newId(), type: "heading", text: "This week at church", align: "left" },
        { id: newId(), type: "text", text: "Dear {{first_name}},\n\nA short welcome.", align: "left" },
        { id: newId(), type: "divider" },
        { id: newId(), type: "heading", text: "First update", align: "left" },
        { id: newId(), type: "text", text: "A few sentences about it.", align: "left" },
        { id: newId(), type: "divider" },
        { id: newId(), type: "heading", text: "Second update", align: "left" },
        { id: newId(), type: "text", text: "A few sentences about it.", align: "left" },
      ]),
  },
  {
    id: "event",
    name: "Event invitation",
    description: "Picture, details and a sign-up button.",
    build: () =>
      doc([
        { id: newId(), type: "heading", text: "You’re invited", align: "center" },
        {
          id: newId(),
          type: "text",
          text: "Date · Time · Place\n\nA sentence about what to expect.",
          align: "center",
        },
        { id: newId(), type: "button", label: "Register now", url: "", align: "center", style: "filled" },
      ]),
  },
];
