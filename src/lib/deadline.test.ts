import { describe, expect, it, vi, afterEach } from "vitest";
import { getDeadlineStatus } from "@/lib/deadline";

/**
 * These pin the timezone bug that shipped before: catalogue dates are plain
 * YYYY-MM-DD, and parsing them as UTC midnight marked a listing "Closed" a day
 * early everywhere west of Greenwich.
 */
afterEach(() => vi.useRealTimers());

const at = (local: string) => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(local));
};

describe("getDeadlineStatus", () => {
  it("keeps a listing open on the morning of its deadline", () => {
    at("2026-09-20T09:00:00");
    const s = getDeadlineStatus("2026-09-20");
    expect(s.status).toBe("closing-soon");
    expect(s.daysLeft).toBe(1);
  });

  it("closes it once the deadline day is over", () => {
    at("2026-09-21T00:30:00");
    expect(getDeadlineStatus("2026-09-20").status).toBe("closed");
  });

  it("flags the next month as closing soon and further out as open", () => {
    at("2026-09-20T09:00:00");
    expect(getDeadlineStatus("2026-10-10").status).toBe("closing-soon");
    expect(getDeadlineStatus("2027-01-10").status).toBe("open");
  });

  it("reports a future opening date rather than the deadline", () => {
    at("2026-09-20T09:00:00");
    const s = getDeadlineStatus("2027-01-31", "2026-10-01");
    expect(s.status).toBe("opens-later");
    expect(s.label).toContain("Opens in");
  });

  it("treats a listing that opens today as already open", () => {
    at("2026-09-20T09:00:00");
    expect(getDeadlineStatus("2026-12-01", "2026-09-20").status).toBe("open");
  });

  it("falls back to TBA with no date", () => {
    at("2026-09-20T09:00:00");
    expect(getDeadlineStatus(null).status).toBe("rolling");
    expect(getDeadlineStatus(null).label).toBe("Deadline TBA");
  });
});
