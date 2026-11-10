import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { PasswordInput } from "./password-input";

describe("PasswordInput", () => {
  it("renders as type password initially with show toggle", () => {
    render(<PasswordInput id="pwd" placeholder="Enter password" />);
    const input = screen.getByPlaceholderText("Enter password");
    expect(input).toHaveAttribute("type", "password");

    const toggle = screen.getByRole("button", { name: "Show password" });
    expect(toggle).toHaveAttribute("type", "button");
    expect(toggle).toHaveAttribute("aria-pressed", "false");
  });

  it("toggles between password and plain text when eye button is clicked", async () => {
    const user = userEvent.setup();
    render(<PasswordInput id="pwd" placeholder="Enter password" />);
    const input = screen.getByPlaceholderText("Enter password");
    const toggle = screen.getByRole("button", { name: "Show password" });

    // Click to show password
    await user.click(toggle);
    expect(input).toHaveAttribute("type", "text");
    expect(toggle).toHaveAttribute("aria-label", "Hide password");
    expect(toggle).toHaveAttribute("aria-pressed", "true");

    // Click again to hide password
    await user.click(toggle);
    expect(input).toHaveAttribute("type", "password");
    expect(toggle).toHaveAttribute("aria-label", "Show password");
    expect(toggle).toHaveAttribute("aria-pressed", "false");
  });

  it("allows typing and handles user input", async () => {
    const user = userEvent.setup();
    render(<PasswordInput id="pwd" placeholder="Enter password" />);
    const input = screen.getByPlaceholderText("Enter password") as HTMLInputElement;

    await user.type(input, "Secret123!");
    expect(input.value).toBe("Secret123!");
  });
});
