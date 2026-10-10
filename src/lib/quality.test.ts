import { describe, expect, it } from "vitest";
import { allOpportunities, type Opportunity } from "@/data/opportunities";
import { isBoilerplateBlurb, qualityScore } from "@/lib/quality";
import { QUALITY_THRESHOLD } from "@/config/seo";
import { deadlineSentence, gradesLabel, summarySentence } from "@/lib/opportunityFacts";

const byId = (id: string) => allOpportunities.find((o) => o.id === id)!;

describe("quality score", () => {
  it("scores templated import rows below the threshold", () => {
    const nyc = allOpportunities.filter((o) => o.id.startsWith("nyc-dycd-"));
    expect(nyc.length).toBeGreaterThan(0);
    for (const o of nyc) {
      expect(isBoilerplateBlurb(o)).toBe(true);
      expect(qualityScore(o).score).toBeLessThan(QUALITY_THRESHOLD);
    }
  });

  it("keeps the pages that already rank above the threshold", () => {
    for (const id of ["nyt-essay", "ccc-youthaction-nyc", "national-wwii-writing-contest", "naclo-north-american-computational-linguistics-open-competition"]) {
      expect(qualityScore(byId(id)).score, id).toBeGreaterThanOrEqual(QUALITY_THRESHOLD);
    }
  });
});

describe("opportunity facts", () => {
  const base: Opportunity = {
    id: "x", title: "Test Program", org: "Test Org", category: "Internship", fields: [], location: "Boston, Massachusetts, USA",
    format: "In-person", cost: "Free", grades: [10, 11], deadline: null, prestige: 1, blurb: "b", url: "https://example.org",
  };

  it("builds the summary only from fields", () => {
    expect(summarySentence(base)).toBe(
      "Test Program is a free, in-person internship from Test Org for high school students in grades 10-11, based in Boston, Massachusetts.",
    );
    expect(summarySentence({ ...base, format: "Online", cost: "Paid", location: "Online, USA" })).toMatch(/^Test Program is an online internship/);
  });

  it("never invents a deadline", () => {
    const now = Date.parse("2026-10-10T12:00:00Z");
    expect(deadlineSentence(base, now)).toMatch(/No deadline is posted/);
    expect(deadlineSentence({ ...base, deadline: "2026-09-01" }, now)).toMatch(/closed for this cycle/);
    expect(deadlineSentence({ ...base, deadline: "2027-01-15" }, now)).toBe("Applications close January 15, 2027.");
  });

  it("labels grades", () => {
    expect(gradesLabel([11])).toBe("grade 11");
    expect(gradesLabel([9, 10, 11, 12])).toBe("grades 9-12");
  });
});
