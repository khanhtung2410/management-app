import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./Badge";

describe("Badge", () => {
    it("renders its configured label and colors", () => {
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

        expect(badge.getAttribute("style")).toContain("background-color: rgb(220, 252, 231)");
        expect(badge.getAttribute("style")).toContain("color: rgb(21, 128, 61)");
        expect(badge.classList.contains("text-xs")).toBe(true);
    });

    it("supports the larger presentation", () => {
        render(
            <Badge
                config={{ label: "Đang thực hiện", bg: "#DBEAFE", color: "#1D4ED8" }}
                size="md"
            />
        );

        const badge = screen.getByText("Đang thực hiện");

        expect(badge.classList.contains("text-sm")).toBe(true);
        expect(badge.classList.contains("py-1.5")).toBe(true);
    });
});
