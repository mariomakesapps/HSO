import { describe, expect, it } from "vitest";
import { matchesQuery } from "@/lib/search";
import type { Opportunity } from "@/data/opportunities";

const opp = (over: Partial<Opportunity>): Opportunity => ({
  id: Math.random().toString(36),
  title: "Summer Research Internship",
  org: "Example Medical Center",
  category: "Internship",
  fields: ["Medicine", "Biology"] as never,
  location: "Brooklyn, New York, USA",
  format: "In-person",
  cost: "Stipend",
  grades: [11, 12],
  deadline: null,
  prestige: 2,
  blurb: "Hands-on lab work with mentors.",
  url: "https://example.org",
  ...over,
});

describe("matchesQuery", () => {
  const o = opp({});

  it("needs every word, in any order", () => {
    expect(matchesQuery(o, "new york research")).toBe(true);
    expect(matchesQuery(o, "research brooklyn")).toBe(true);
    expect(matchesQuery(o, "research chicago")).toBe(false);
  });

  it("finds plurals and the words listings use for what students type", () => {
    expect(matchesQuery(o, "internships")).toBe(true);
    expect(matchesQuery(o, "medical internship")).toBe(true);
    expect(matchesQuery(o, "paid")).toBe(true); // stipend
    expect(matchesQuery(o, "nyc")).toBe(true);
  });

  it("matches at the start of words only, and short words as whole words", () => {
    expect(matchesQuery(opp({ title: "Submit an essay", org: "X", blurb: "" }), "mit")).toBe(false);
    expect(matchesQuery(opp({ title: "MIT PRIMES", org: "MIT", blurb: "" }), "mit")).toBe(true);
    expect(matchesQuery(opp({ title: "Aftermath", fields: [] as never, blurb: "" }), "math")).toBe(false);
    expect(matchesQuery(opp({ title: "Mathematics camp", blurb: "" }), "math")).toBe(true);
  });

  it("treats grade words as eligibility", () => {
    expect(matchesQuery(o, "seniors")).toBe(true);
    expect(matchesQuery(opp({ grades: [9, 10] }), "seniors")).toBe(false);
  });

  it("ignores filler words, and an empty query matches everything", () => {
    expect(matchesQuery(o, "research programs for high school students")).toBe(true);
    expect(matchesQuery(o, "")).toBe(true);
  });
});
