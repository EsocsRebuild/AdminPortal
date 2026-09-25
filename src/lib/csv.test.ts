import { describe, expect, it } from "vitest";

import { csvSafe, parseCsv } from "./csv";

describe("parseCsv", () => {
  it("handles quotes, embedded commas, newlines and CRLF", () => {
    const text = '﻿email,name\r\n"a@x.com","Okafor, Ada"\r\nb@x.com,"Line\nbreak ""quoted"""\n\n';
    expect(parseCsv(text)).toEqual([
      ["email", "name"],
      ["a@x.com", "Okafor, Ada"],
      ["b@x.com", 'Line\nbreak "quoted"'],
    ]);
  });

  it("keeps empty trailing fields", () => {
    expect(parseCsv("a,b,\n1,,3")).toEqual([
      ["a", "b", ""],
      ["1", "", "3"],
    ]);
  });
});

describe("csvSafe", () => {
  it("prefixes formula-like values", () => {
    expect(csvSafe("=HYPERLINK()")).toBe("'=HYPERLINK()");
    expect(csvSafe("Ada")).toBe("Ada");
  });
});
