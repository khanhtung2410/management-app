import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
    it("renders a configured label and colors", () => {
        render(
            <Badge
                config={{
                    label: "Hoàn thành",
                    bg: "#DCFCE7",
                    color: "#15803D",
                }}
            />
        );

        const badge = screen.getByText("Hoàn thành");
        expect(badge.classList.contains("rounded-full")).toBe(true);
        expect(badge.style.backgroundColor).toBe("rgb(220, 252, 231)");
        expect(badge.style.color).toBe("rgb(21, 128, 61)");
    });

    it("supports the larger size and custom classes", () => {
        render(
            <Badge
                config={{ label: "Đang hoạt động", bg: "#DCFCE7", color: "#15803D" }}
                size="md"
                className="custom-badge"
            />
        );

        const badge = screen.getByText("Đang hoạt động");
        expect(badge.classList.contains("text-sm")).toBe(true);
        expect(badge.classList.contains("custom-badge")).toBe(true);
    });
});