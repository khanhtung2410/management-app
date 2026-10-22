import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
    it("applies the shared surface styles by default", () => {
        render(<Card>Card content</Card>);

        const card = screen.getByText("Card content");

        expect(card.classList.contains("rounded-xl")).toBe(true);
        expect(card.classList.contains("bg-white")).toBe(true);
        expect(card.classList.contains("shadow-md")).toBe(true);
    });

    it("supports the lighter shadow and additional attributes", () => {
        render(
            <Card shadow="sm" className="p-4" aria-label="Summary">
                Summary content
            </Card>
        );

        const card = screen.getByLabelText("Summary");

        expect(card.classList.contains("shadow-sm")).toBe(true);
        expect(card.classList.contains("p-4")).toBe(true);
    });
});
