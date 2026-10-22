import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
    it("defaults to a non-submitting button", () => {
        render(<Button>Thao tác</Button>);

        expect(
            screen.getByRole("button", { name: "Thao tác" }).getAttribute("type"),
        ).toBe("button");
    });

    it("keeps an explicit submit type", () => {
        render(<Button type="submit">Gửi</Button>);

        expect(
            screen.getByRole("button", { name: "Gửi" }).getAttribute("type"),
        ).toBe("submit");
    });
});
