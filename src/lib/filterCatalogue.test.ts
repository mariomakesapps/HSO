import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { applyFilters, facetCounts, listingFilterStates } from "@/lib/filterSort";
import { EMPTY_FILTERS, type FilterState } from "@/components/Filters";
import { DEFAULT_EXTRA, STATUS_OPTIONS, type ExtraFilterState } from "@/components/ExtraFilters";
import { allOpportunities, locationState, locationStates, type Opportunity } from "@/data/opportunities";
import { getDeadlineStatus } from "@/lib/deadline";

const opp = (over: Partial<Opportunity> & { id: string }): Opportunity => ({
  title: "Test Program",
  org: "Org",
  category: "Research",
  fields: ["Biology"] as never,
  location: "Boston, Massachusetts, USA",
  format: "In-person",
  cost: "Free",
  grades: [11],
  deadline: null,
  prestige: 2,
  blurb: "A program.",
  url: "https://example.org",
  ...over,
});
const ids = (rows: Opportunity[]) => rows.map((r) => r.id).sort();
const run = (list: Opportunity[], f: Partial<FilterState>, e: Partial<ExtraFilterState> = {}) =>
  ids(applyFilters(list, { ...EMPTY_FILTERS, ...f }, { ...DEFAULT_EXTRA, ...e }));

describe("state filter", () => {
  it("finds a listing under every state its location names", () => {
    const list = [opp({ id: "multi", location: "Maryland / Colorado / Georgia / Texas / Hawaii / Utah / Alaska, USA" })];
    for (const s of ["Maryland", "Colorado", "Georgia", "Texas", "Hawaii", "Utah", "Alaska"]) {
      expect(run(list, {}, { states: [s] })).toEqual(["multi"]);
    }
    expect(run(list, {}, { states: ["Virginia"] })).toEqual([]);
  });

  it("puts Kansas City, Missouri in Missouri, not Kansas", () => {
    expect(locationState("Kansas City, Missouri, USA")).toBe("Missouri");
    expect(locationStates("Kansas City, Missouri, USA")).toEqual(["Missouri"]);
  });

  it("does not read Washington Heights or Washington, DC as Washington state", () => {
    expect(locationStates("Washington Heights, New York, USA")).toEqual(["New York"]);
    expect(locationStates("Washington, District of Columbia, USA")).toEqual(["District of Columbia"]);
  });

  it("keeps West Virginia and Virginia apart", () => {
    expect(locationStates("Morgantown, West Virginia, USA")).toEqual(["West Virginia"]);
    expect(locationStates("Fairfax, Virginia, USA")).toEqual(["Virginia"]);
  });

  it("counts remote programs and 'Online' locations as Nationwide", () => {
    const list = [
      opp({ id: "remote", format: "Online", location: "Boston, Massachusetts, USA" }),
      opp({ id: "online-loc", format: "Hybrid", location: "Online, USA" }),
      opp({ id: "usa", location: "USA" }),
      opp({ id: "local", location: "Austin, Texas, USA" }),
    ];
    expect(run(list, {}, { states: ["Nationwide"] })).toEqual(["online-loc", "remote", "usa"]);
    expect(run(list, {}, { states: ["Massachusetts"] })).toEqual(["remote"]);
  });
});

describe("deadline month filter", () => {
  const original = process.env.TZ;
  beforeEach(() => {
    process.env.TZ = "America/Los_Angeles";
  });
  afterEach(() => {
    process.env.TZ = original;
  });

  it("files a 1st-of-the-month deadline under its own month in US time zones", () => {
    const list = [opp({ id: "mar1", deadline: "2026-03-01" }), opp({ id: "feb28", deadline: "2026-02-28" })];
    expect(run(list, {}, { deadlineMonths: ["3"] })).toEqual(["mar1"]);
    expect(run(list, {}, { deadlineMonths: ["2"] })).toEqual(["feb28"]);
  });
});

describe("status filter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-12T12:00:00"));
  });
  afterEach(() => vi.useRealTimers());

  const list = [
    opp({ id: "open", deadline: "2027-02-01" }),
    opp({ id: "soon", deadline: "2026-10-20" }),
    opp({ id: "later", deadline: "2027-03-01", opensAt: "2026-12-01" }),
    opp({ id: "tba", deadline: null }),
    opp({ id: "closed", deadline: "2026-09-01" }),
  ];

  it("includes closing-soon listings under Open now", () => {
    expect(run(list, {}, { statuses: ["Open"] })).toEqual(["open", "soon"]);
    expect(run(list, {}, { statuses: ["Closing soon"] })).toEqual(["soon"]);
  });

  it("has an option for listings that have not opened yet", () => {
    expect(run(list, {}, { statuses: ["Opens later"] })).toEqual(["later"]);
  });

  it("returns every listing when every status option is ticked", () => {
    expect(run(list, {}, { statuses: STATUS_OPTIONS.map((s) => s.value) })).toHaveLength(list.length);
  });
});

/**
 * The real catalogue, checked against reference logic written independently of
 * applyFilters. If a listing is ever missing from (or wrongly in) a filter's
 * results, this names it.
 */
describe("every filter over the real catalogue", () => {
  const all = allOpportunities;
  const check = (f: Partial<FilterState>, e: Partial<ExtraFilterState>, keep: (o: Opportunity) => boolean) => {
    const got = new Set(applyFilters(all, { ...EMPTY_FILTERS, ...f }, { ...DEFAULT_EXTRA, ...e }).map((o) => o.id));
    const want = all.filter(keep).map((o) => o.id);
    expect([...got].sort()).toEqual(want.sort());
  };

  it.each(["Research", "Internship", "Competition", "Summer Program", "Scholarship", "Fellowship"] as const)(
    "category %s",
    (c) => check({ categories: [c] }, {}, (o) => o.category === c),
  );
  it.each([9, 10, 11, 12])("grade %i", (g) => check({ grades: [g] }, {}, (o) => o.grades.includes(g)));
  it.each(["Free", "Paid", "Stipend"] as const)("cost %s", (c) => check({ costs: [c] }, {}, (o) => o.cost === c));
  it.each(["Online", "In-person", "Hybrid"] as const)("format %s", (f) => check({ formats: [f] }, {}, (o) => o.format === f));
  it("free / aid available", () => check({}, { freeOnly: true }, (o) => o.cost !== "Paid"));
  it.each(["California", "New York", "Massachusetts", "Texas", "Maryland", "Missouri", "Washington"])("state %s", (s) =>
    check({}, { states: [s] }, (o) => locationStates(o.location).includes(s)),
  );
  it("state Nationwide", () =>
    check({}, { states: ["Nationwide"] }, (o) => o.format === "Online" || ["Nationwide", "Online"].includes(locationState(o.location))),
  );
  it.each(Array.from({ length: 12 }, (_, i) => i + 1))("deadline month %i", (m) =>
    check({}, { deadlineMonths: [String(m)] }, (o) => !!o.deadline && Number(o.deadline.split("-")[1]) === m),
  );
  it("search is case-insensitive and matches short words as whole words", () =>
    check({ query: "  MIT " }, {}, (o) => /(^|[^a-z0-9])mit($|[^a-z0-9])/.test([o.title, o.org, o.location, o.blurb, ...o.fields, o.category].join(" ").toLowerCase())),
  );

  it("every listing is reachable through the state filter", () => {
    const unreachable = all.filter((o) => !listingFilterStates(o).some((s) => s !== "Online" && s !== "Other"));
    expect(unreachable.map((o) => `${o.id}: ${o.location}`)).toEqual([]);
  });

  it("every listing falls under at least one status option", () => {
    const everyStatus = { ...DEFAULT_EXTRA, statuses: STATUS_OPTIONS.map((x) => x.value) };
    const missed = all.filter((o) => applyFilters([o], EMPTY_FILTERS, everyStatus).length === 0);
    expect(missed.map((o) => `${o.id}: ${getDeadlineStatus(o.deadline, o.opensAt).status}`)).toEqual([]);
  });

  it("facet counts equal the number of results each option returns", () => {
    const states = facetCounts(all, EMPTY_FILTERS, DEFAULT_EXTRA, "states", listingFilterStates);
    for (const [s, n] of Object.entries(states)) {
      if (s === "Online") continue;
      expect([s, applyFilters(all, EMPTY_FILTERS, { ...DEFAULT_EXTRA, states: [s] }).length]).toEqual([s, n]);
    }
  });
});
