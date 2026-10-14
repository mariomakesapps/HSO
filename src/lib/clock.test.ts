import { afterEach, describe, expect, it } from "vitest";
import { dayEdge, freezeClock, now, releaseClock } from "@/lib/clock";
import { getDeadlineStatus } from "@/lib/deadline";

afterEach(() => releaseClock());

describe("clock", () => {
  it("is frozen at the build time until released", () => {
    freezeClock(Date.UTC(2026, 9, 12, 12));
    expect(now()).toBe(Date.UTC(2026, 9, 12, 12));
    releaseClock();
    expect(Math.abs(now() - Date.now())).toBeLessThan(1000);
  });

  it("reads day boundaries in UTC while frozen, so server and browser agree", () => {
    freezeClock(0);
    expect(dayEdge("2026-12-11", "end")).toBe(Date.parse("2026-12-11T23:59:59Z"));
    expect(dayEdge("2026-12-11", "start")).toBe(Date.parse("2026-12-11T00:00:00Z"));
  });

  it("gives the same deadline label for the same build time in any time zone", () => {
    // 22:00 in New York on Oct 13 is already Oct 14 in UTC: the case that broke hydration.
    freezeClock(Date.parse("2026-10-14T02:00:00Z"));
    expect(getDeadlineStatus("2026-10-20").label).toBe("Closing soon - 7d");
  });
});
