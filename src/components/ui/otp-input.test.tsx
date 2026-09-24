import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";

import { OtpInput } from "./otp-input";

function Harness({ onComplete }: { onComplete: (v: string) => void }) {
  const [value, setValue] = React.useState("");
  return <OtpInput value={value} onChange={setValue} onComplete={onComplete} />;
}

describe("OtpInput", () => {
  it("advances as you type and completes", async () => {
    const onComplete = vi.fn();
    render(<Harness onComplete={onComplete} />);
    await userEvent.click(screen.getByLabelText("Digit 1 of 6"));
    await userEvent.keyboard("123456");
    expect(onComplete).toHaveBeenCalledWith("123456");
    expect(screen.getByLabelText("Digit 6 of 6")).toHaveValue("6");
  });

  it("fills every box from a pasted code and ignores non-digits", () => {
    const onComplete = vi.fn();
    render(<Harness onComplete={onComplete} />);
    fireEvent.change(screen.getByLabelText("Digit 1 of 6"), { target: { value: "98-76 54" } });
    expect(onComplete).toHaveBeenCalledWith("987654");
  });

  it("backspace on an empty box clears the previous digit", async () => {
    render(<Harness onComplete={() => {}} />);
    await userEvent.click(screen.getByLabelText("Digit 1 of 6"));
    await userEvent.keyboard("12");
    await userEvent.keyboard("{Backspace}");
    expect(screen.getByLabelText("Digit 2 of 6")).toHaveValue("");
    expect(screen.getByLabelText("Digit 1 of 6")).toHaveValue("1");
  });
});
