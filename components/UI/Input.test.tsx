import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "./Input";

describe("Input", () => {
    it("connects its label to the input", () => {
        render(
            <Input
                label="Email"
                input={{ type: "email", "aria-label": "Email address" }}
            />
        );

        const input = screen.getByLabelText("Email");

        expect(input.getAttribute("type")).toBe("email");
        expect(input.getAttribute("aria-label")).toBe("Email address");
    });

    it("exposes errors accessibly and applies error focus styles", () => {
        render(<Input label="Email" error="Email không hợp lệ" />);

        const input = screen.getByLabelText("Email");
        const error = screen.getByRole("alert");

        expect(input.getAttribute("aria-invalid")).toBe("true");
        expect(input.getAttribute("aria-describedby")).toBe(error.id);
        expect(input.classList.contains("focus:ring-red-100")).toBe(true);
        expect(error.textContent).toBe("Email không hợp lệ");
    });

    it("keeps caller descriptions and allows style overrides", () => {
        render(
            <Input
                className="custom-wrapper"
                input={{
                    "aria-describedby": "email-hint",
                    className: "custom-input",
                }}
                error="Email không hợp lệ"
            />
        );

        const input = screen.getByRole("textbox");
        const wrapper = input.parentElement;

        expect(input.getAttribute("aria-describedby")).toContain("email-hint");
        expect(input.getAttribute("aria-describedby")).toContain(
            screen.getByRole("alert").id
        );
        expect(input.classList.contains("custom-input")).toBe(true);
        expect(wrapper?.classList.contains("custom-wrapper")).toBe(true);
    });
});
