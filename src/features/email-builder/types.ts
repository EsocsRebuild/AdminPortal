/**
 * An email is a list of blocks, not HTML. The API renders the final,
 * client-compatible HTML (and a plain-text part) from this document, so
 * nothing written in the portal is ever injected as markup.
 */
export type Align = "left" | "center";

export type Block =
  | { id: string; type: "heading"; text: string; align: Align }
  | { id: string; type: "text"; text: string; align: Align }
  | { id: string; type: "button"; label: string; url: string; align: Align; style: "filled" | "outline" }
  | { id: string; type: "image"; src: string; alt: string; href: string; width: "full" | "medium" }
  | { id: string; type: "divider" }
  | { id: string; type: "spacer"; size: "sm" | "md" | "lg" };

export type BlockType = Block["type"];

export interface EmailDocument {
  version: 1;
  settings: {
    /** Hex colour for buttons and links. */
    accentColor: string;
    background: "light" | "muted";
  };
  blocks: Block[];
}

export const emptyDocument = (): EmailDocument => ({
  version: 1,
  settings: { accentColor: "#2f4fb4", background: "muted" },
  blocks: [],
});
