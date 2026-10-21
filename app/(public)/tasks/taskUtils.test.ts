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

    it("keeps a task active when its due date is exactly now", () => {
        expect(getTaskDisplayStatus(taskStatus.Active, now, now))
            .toBe(taskStatus.Active);
    });

    it("returns the same result for the same dates without mutating them", () => {
        const dueDate = new Date("2026-10-19T10:00:00.000Z");
        const originalDueDate = dueDate.getTime();
        const originalNow = now.getTime();

        const firstResult = getTaskDisplayStatus(taskStatus.Active, dueDate, now);
        const secondResult = getTaskDisplayStatus(taskStatus.Active, dueDate, now);

        expect(firstResult).toBe(taskStatus.Overdue);
        expect(secondResult).toBe(firstResult);
        expect(dueDate.getTime()).toBe(originalDueDate);
        expect(now.getTime()).toBe(originalNow);
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
