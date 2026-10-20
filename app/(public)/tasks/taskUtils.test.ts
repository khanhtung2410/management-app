import { describe, expect, it } from "vitest";
import { taskStatus } from "@/constants/statuses";
import { formatTaskDate, getTaskDisplayStatus } from "./taskUtils";

describe("getTaskDisplayStatus", () => {
    const now = new Date("2026-10-20T10:00:00.000Z");

    it("keeps completed tasks complete even after the due date", () => {
        expect(getTaskDisplayStatus(taskStatus.Complete, "2020-01-01", now))
            .toBe(taskStatus.Complete);
    });

    it("marks unfinished tasks with a past due date as overdue", () => {
        expect(getTaskDisplayStatus(taskStatus.Active, "2020-01-01", now))
            .toBe(taskStatus.Overdue);
    });

    it("keeps unfinished tasks with a future due date active", () => {
        expect(getTaskDisplayStatus(taskStatus.Active, "2030-01-01", now))
            .toBe(taskStatus.Active);
    });
});

describe("formatTaskDate", () => {
    it("formats a date string and a Date consistently", () => {
        const value = "2026-10-20T10:00:00.000Z";

        expect(formatTaskDate(value)).toBe(formatTaskDate(new Date(value)));
    });

    it("returns an invalid date string unchanged", () => {
        expect(formatTaskDate("invalid date")).toBe("invalid date");
    });
});
