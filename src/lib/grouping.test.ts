import { describe, expect, it } from "vitest";
import type { Opportunity } from "@/data/opportunities";
import { groupSimilarListings, siteProgramName } from "@/lib/grouping";

const opp = (id: string, title: string, category: Opportunity["category"] = "Internship"): Opportunity => ({
  id, title, org: "Org", category, fields: [], location: "Bronx, New York, USA", format: "In-person",
  cost: "Stipend", grades: [9, 10, 11, 12], deadline: null, prestige: 1, blurb: "b", url: "https://example.org",
});

describe("groupSimilarListings", () => {
  it("reads the program name from '<program> at <site>'", () => {
    expect(siteProgramName("Summer Youth Employment at Betances Community Center")).toBe("Summer Youth Employment");
    expect(siteProgramName("Research Science Institute")).toBeNull();
  });

  it("collapses four or more sites of one program into a group at the first position", () => {
    const list = [
      opp("a", "Alpha Internship"),
      ...["One", "Two", "Three", "Four"].map((s, i) => opp(`s${i}`, `Summer Youth Employment at ${s}`)),
      opp("b", "Beta Internship"),
    ];
    const rows = groupSimilarListings(list);
    expect(rows.map((r) => r.kind)).toEqual(["single", "group", "single"]);
    const g = rows[1];
    expect(g.kind === "group" && g.items.map((o) => o.id)).toEqual(["s0", "s1", "s2", "s3"]);
  });

  it("leaves small runs as single cards", () => {
    const rows = groupSimilarListings([opp("x", "Beacon at MS 210"), opp("y", "Beacon at JHS 194")]);
    expect(rows.every((r) => r.kind === "single")).toBe(true);
  });
});
