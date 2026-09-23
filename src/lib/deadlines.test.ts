import { describe, expect, it } from "vitest";
import { closingWithin, daysUntil, openingWithin } from "@/lib/deadlines";
import type { Opportunity } from "@/data/opportunities";

const NOW = new Date("2026-09-19T12:00:00").getTime();

const opp = (over: Partial<Opportunity> & { id: string }): Opportunity => ({
  title: "Test program",
  org: "Test org",
  category: "Research",
  fields: ["STEM"] as Opportunity["fields"],
  location: "USA",
  format: "Online",
  cost: "Free",
  grades: [11],
  deadline: null,
  prestige: 1,
  blurb: "A listing used only in tests.",
  url: "https://example.org/",
  ...over,
});

describe("daysUntil", () => {
  it("counts whole days to the end of the deadline day", () => {
    expect(daysUntil("2026-09-19", NOW)).toBe(1); // closes tonight, still today
    expect(daysUntil("2026-09-26", NOW)).toBe(8);
  });

  it("returns null for missing or unparseable dates", () => {
    expect(daysUntil(null, NOW)).toBeNull();
    expect(daysUntil("not a date", NOW)).toBeNull();
  });

  it("goes negative once the date has passed", () => {
    expect(daysUntil("2026-09-01", NOW)).toBeLessThan(0);
  });
});

describe("closingWithin", () => {
  const list = [
    opp({ id: "past", deadline: "2026-08-01" }),
    opp({ id: "week", deadline: "2026-09-23" }),
    opp({ id: "month", deadline: "2026-10-10" }),
    opp({ id: "later", deadline: "2027-05-01" }),
    opp({ id: "tba", deadline: null }),
  ];

  it("keeps only listings inside the window", () => {
    expect(closingWithin(list, 7, NOW).map((o) => o.id)).toEqual(["week"]);
    expect(closingWithin(list, 30, NOW).map((o) => o.id)).toEqual(["week", "month"]);
  });

  it("drops passed deadlines and listings with no date", () => {
    const ids = closingWithin(list, 365, NOW).map((o) => o.id);
    expect(ids).not.toContain("past");
    expect(ids).not.toContain("tba");
  });

  it("sorts soonest first", () => {
    expect(closingWithin(list, 400, NOW).map((o) => o.id)).toEqual(["week", "month", "later"]);
  });

  it("excludes listings whose application window has not opened yet", () => {
    const notYetOpen = [opp({ id: "future", deadline: "2026-10-01", opensAt: "2026-09-25" })];
    expect(closingWithin(notYetOpen, 30, NOW)).toEqual([]);
  });
});

describe("openingWithin", () => {
  it("returns only listings that open later, soonest first", () => {
    const list = [
      opp({ id: "opens-soon", deadline: "2027-01-05", opensAt: "2026-10-01" }),
      opp({ id: "opens-later", deadline: "2027-03-01", opensAt: "2026-12-01" }),
      opp({ id: "already-open", deadline: "2026-11-01", opensAt: "2026-09-01" }),
      opp({ id: "no-dates" }),
    ];
    expect(openingWithin(list, 90, NOW).map((o) => o.id)).toEqual(["opens-soon", "opens-later"]);
  });
});
