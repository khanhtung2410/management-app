import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card } from "./Card";

describe("Card", () => {
    it("provides the shared surface styles and renders children", () => {
        render(
            <Card>
                <p>Nội dung thẻ</p>
            </Card>
        );

        const card = screen.getByText("Nội dung thẻ").parentElement;
        expect(card?.classList.contains("rounded-xl")).toBe(true);
        expect(card?.classList.contains("bg-white")).toBe(true);
        expect(card?.classList.contains("shadow-md")).toBe(true);
    });

    it("preserves native div props and custom classes", () => {
        render(
            <Card aria-label="Tóm tắt" className="p-6">
                Nội dung
            </Card>
        );

        const card = screen.getByLabelText("Tóm tắt");
        expect(card.classList.contains("p-6")).toBe(true);
    });

    it("supports the subtle shadow variant", () => {
        const { container } = render(<Card shadow="sm">Tóm tắt</Card>);

        expect(container.firstElementChild?.classList.contains("shadow-sm")).toBe(true);
    });

    it("can render a semantic article with alternate shape and shadow", () => {
        render(
            <Card as="article" rounded="2xl" shadow="sm">
                Thẻ tính năng
            </Card>
        );

        const card = screen.getByRole("article");
        expect(card.classList.contains("rounded-2xl")).toBe(true);
        expect(card.classList.contains("shadow-sm")).toBe(true);
    });
});