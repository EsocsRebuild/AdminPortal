import { describe, expect, it } from "vitest";

import { previewMergeTags, unknownTags } from "./merge-tags";

describe("merge tags", () => {
  it("previews known tags", () => {
    expect(previewMergeTags("Dear {{first_name}},")).toBe("Dear Friend,");
  });
  it("flags typos", () => {
    expect(unknownTags("Hi {{firstname}} and {{first_name}}")).toEqual(["{{firstname}}"]);
  });
});

describe("previewMergeTags whitespace", () => {
  it("keeps line breaks", () => {
    expect(previewMergeTags("Dear {{first_name}},\n\nWelcome")).toBe("Dear Friend,\n\nWelcome");
  });
});
