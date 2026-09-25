import { describe, expect, it } from "vitest";

import { blockSchema, safeUrl } from "./schema";

describe("email links", () => {
  it.each(["https://esocs.org/events", "mailto:office@esocs.org"])("accepts %s", (url) => {
    expect(safeUrl.safeParse(url).success).toBe(true);
  });

  it.each(["javascript:alert(1)", "http://insecure.example", "data:text/html,<script>", "https://x.org/\"onmouseover=\"x", "/relative"])(
    "rejects %s",
    (url) => {
      expect(safeUrl.safeParse(url).success).toBe(false);
    },
  );

  it("requires alt text on images", () => {
    const r = blockSchema.safeParse({ id: "abcd1234", type: "image", src: "https://x.org/a.png", alt: "", href: "", width: "full" });
    expect(r.success).toBe(false);
  });
});
