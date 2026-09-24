import { describe, expect, it } from "vitest";

import { attributeFor } from "./preferences";
import { cn, initials, pluralize } from "./utils";

describe("utils", () => {
  it("merges custom font-size tokens without dropping colours", () => {
    expect(cn("text-sm text-muted-foreground", "text-heading-lg")).toBe(
      "text-muted-foreground text-heading-lg",
    );
  });

  it("builds initials ignoring titles", () => {
    expect(initials("Most Rev. Adaeze Okafor")).toBe("AO");
  });

  it("pluralizes", () => {
    expect(pluralize(1, "row")).toBe("1 row");
    expect(pluralize(1200, "row")).toBe("1,200 rows");
  });

  it("maps preference keys to data attributes", () => {
    expect(attributeFor("sidebarTone")).toBe("data-sidebar-tone");
  });
});
