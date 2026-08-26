import { describe, expect, it } from "vitest";
import { applyFilters, recommendedScore } from "@/lib/filterSort";
import { EMPTY_FILTERS } from "@/components/Filters";
import { DEFAULT_EXTRA } from "@/components/ExtraFilters";
import type { Opportunity } from "@/data/opportunities";

const opp = (over: Partial<Opportunity>): Opportunity => ({
  id: "x",
  title: "Test Program",
  org: "Org",
  category: "Research",
  fields: ["Biology"] as never,
  location: "USA",
  format: "In-person",
  cost: "Free",
  grades: [11, 12],
  deadline: null,
  prestige: 2,
  blurb: "A program.",
  url: "https://example.org",
  ...over,
});

const ids = (rows: Opportunity[]) => rows.map((r) => r.id).sort();

describe("applyFilters — multi-select semantics", () => {
  const list = [
    opp({ id: "research-online", category: "Research", format: "Online", grades: [11] }),
    opp({ id: "internship-inperson", category: "Internship", format: "In-person", grades: [12] }),
    opp({ id: "comp-hybrid", category: "Competition", format: "Hybrid", grades: [9, 10] }),
    opp({ id: "sch-online", category: "Scholarship", format: "Online", grades: [12], cost: "Paid" }),
  ];

  it("returns everything when no filter is selected", () => {
    expect(applyFilters(list, EMPTY_FILTERS, DEFAULT_EXTRA)).toHaveLength(4);
  });

  it("ORs values within one dimension", () => {
    const out = applyFilters(
      list,
      { ...EMPTY_FILTERS, categories: ["Research", "Competition"] },
      DEFAULT_EXTRA,
    );
    expect(ids(out)).toEqual(["comp-hybrid", "research-online"]);
  });

  it("ANDs across dimensions", () => {
    // Research OR Scholarship, that is also Online -> both happen to be online
    const out = applyFilters(
      list,
      { ...EMPTY_FILTERS, categories: ["Research", "Scholarship"], formats: ["Online"] },
      DEFAULT_EXTRA,
    );
    expect(ids(out)).toEqual(["research-online", "sch-online"]);
  });

  it("matches a grade if any selected grade is offered", () => {
    const out = applyFilters(list, { ...EMPTY_FILTERS, grades: [9, 12] }, DEFAULT_EXTRA);
    expect(ids(out)).toEqual(["comp-hybrid", "internship-inperson", "sch-online"]);
  });

  it("supports selecting several formats at once", () => {
    const out = applyFilters(
      list,
      { ...EMPTY_FILTERS, formats: ["Online", "Hybrid"] },
      DEFAULT_EXTRA,
    );
    expect(ids(out)).toEqual(["comp-hybrid", "research-online", "sch-online"]);
  });

  it("combines cost with format", () => {
    const out = applyFilters(
      list,
      { ...EMPTY_FILTERS, formats: ["Online"], costs: ["Free"] },
      DEFAULT_EXTRA,
    );
    expect(ids(out)).toEqual(["research-online"]);
  });

  it("returns nothing when selections cannot co-exist", () => {
    const out = applyFilters(
      list,
      { ...EMPTY_FILTERS, categories: ["Research"], formats: ["In-person"] },
      DEFAULT_EXTRA,
    );
    expect(out).toHaveLength(0);
  });
});

describe("applyFilters — extra filters", () => {
  const list = [
    opp({ id: "bio", fields: ["Biology", "Research"] as never }),
    opp({ id: "cs", fields: ["Computer Science"] as never }),
    opp({ id: "math", fields: ["Math"] as never }),
  ];

  it("ORs selected fields", () => {
    const out = applyFilters(list, EMPTY_FILTERS, { ...DEFAULT_EXTRA, fields: ["Biology", "Math"] });
    expect(ids(out)).toEqual(["bio", "math"]);
  });

  it("freeOnly keeps Free and Stipend, drops Paid", () => {
    const costs = [
      opp({ id: "free", cost: "Free" }),
      opp({ id: "stipend", cost: "Stipend" }),
      opp({ id: "paid", cost: "Paid" }),
    ];
    const out = applyFilters(costs, EMPTY_FILTERS, { ...DEFAULT_EXTRA, freeOnly: true });
    expect(ids(out)).toEqual(["free", "stipend"]);
  });

  it("treats a fully online program as available nationwide", () => {
    // A remote program serves a student in any state, so it must surface under
    // "Nationwide" even when its location string is a specific city.
    const rows = [
      opp({ id: "remote-nyc", location: "New York, USA", format: "Online" }),
      opp({ id: "local-nyc", location: "New York, USA", format: "In-person" }),
    ];
    const out = applyFilters(rows, EMPTY_FILTERS, { ...DEFAULT_EXTRA, states: ["Nationwide"] });
    expect(ids(out)).toEqual(["remote-nyc"]);
  });

  it("ORs deadline months", () => {
    const rows = [
      opp({ id: "jan", deadline: "2027-01-15" }),
      opp({ id: "mar", deadline: "2027-03-15" }),
      opp({ id: "jun", deadline: "2027-06-15" }),
      opp({ id: "none", deadline: null }),
    ];
    const out = applyFilters(rows, EMPTY_FILTERS, { ...DEFAULT_EXTRA, deadlineMonths: ["1", "6"] });
    expect(ids(out)).toEqual(["jan", "jun"]);
  });

  it("still applies the text query alongside list filters", () => {
    const rows = [
      opp({ id: "keep", title: "Quantum Research Institute", category: "Research" }),
      opp({ id: "drop", title: "Poetry Workshop", category: "Research" }),
    ];
    const out = applyFilters(
      rows,
      { ...EMPTY_FILTERS, query: "quantum", categories: ["Research"] },
      DEFAULT_EXTRA,
    );
    expect(ids(out)).toEqual(["keep"]);
  });
});

describe("recommendedScore — what leads the default view", () => {
  const base = {
    location: "USA",
    format: "Online" as const,
    cost: "Free" as const,
    deadline: "2027-03-01",
    prestige: 3 as const,
  };

  it("ranks a national fellowship above an equally prestigious competition", () => {
    const fellowship = opp({ id: "f", category: "Fellowship", ...base });
    const competition = opp({ id: "c", category: "Competition", ...base });
    expect(recommendedScore(fellowship)).toBeGreaterThan(recommendedScore(competition));
  });

  it("demotes programs a student cannot enter on their own", () => {
    const open = opp({ id: "open", category: "Competition", blurb: "Enter online individually.", ...base });
    const gatekept = opp({
      id: "gated",
      category: "Competition",
      blurb: "Invitational round following the qualifying exam.",
      ...base,
    });
    expect(recommendedScore(open)).toBeGreaterThan(recommendedScore(gatekept));
  });

  it("demotes awards you qualify for automatically rather than apply to", () => {
    const applyable = opp({ id: "a", category: "Scholarship", blurb: "Submit an essay and two references.", ...base });
    const psat = opp({
      id: "b",
      category: "Scholarship",
      blurb: "For juniors who qualify via PSAT/NMSQT scores.",
      ...base,
    });
    expect(recommendedScore(applyable)).toBeGreaterThan(recommendedScore(psat));
  });

  it("ranks a nationally available program above an otherwise identical local one", () => {
    const national = opp({ id: "n", category: "Research", ...base, location: "USA" });
    const local = opp({ id: "l", category: "Research", ...base, location: "Brooklyn, New York, USA", format: "In-person" });
    expect(recommendedScore(national)).toBeGreaterThan(recommendedScore(local));
  });

  it("pushes local after-school feed imports well down", () => {
    const curated = opp({ id: "curated", category: "Summer Program", ...base });
    const feed = opp({ id: "sf-our415-123-drop-in", category: "Summer Program", ...base });
    expect(recommendedScore(curated) - recommendedScore(feed)).toBeGreaterThanOrEqual(14);
  });

  it("sinks listings flagged for review", () => {
    const ok = opp({ id: "ok", category: "Fellowship", ...base });
    const flagged = opp({ id: "flagged", category: "Fellowship", ...base, requiresReview: true });
    expect(recommendedScore(ok)).toBeGreaterThan(recommendedScore(flagged));
  });

  it("weights prestige most heavily among comparable programs", () => {
    const top = opp({ id: "t", category: "Fellowship", ...base, prestige: 3 });
    const low = opp({ id: "l2", category: "Fellowship", ...base, prestige: 1 });
    expect(recommendedScore(top)).toBeGreaterThan(recommendedScore(low));
  });
});
