import { describe, expect, it } from "vitest";
import { allOpportunities } from "@/data/opportunities";

const additions = [
  { id: "lumiere-scholars-essay-award", deadline: "2026-12-20", cost: "Free", grades: [9, 10, 11, 12], category: "Competition", url: "https://www.lumiere-education.com/lumiere-scholars-essay-award" },
  { id: "oxford-essay-prize-2027", deadline: "2027-01-03", cost: "Free", grades: [9, 10, 11, 12], category: "Competition", url: "https://oxford-research.uk.com/essay-competition" },
  { id: "veritas-ai-high-school-hackathon", deadline: "2026-11-13", cost: "Free", grades: [9, 10, 11, 12], category: "Competition", url: "https://highschoolhackathon.org/" },
  { id: "village-virtual-impact-lab-fellowship", deadline: "2026-12-07", cost: "Paid", grades: [11, 12], category: "Fellowship", url: "https://content.gng.org/village" },
];

describe("October 27 supplied opportunities", () => {
  for (const addition of additions) {
    it(`${addition.id} appears once in the public catalogue`, () => {
      expect(allOpportunities.filter((o) => o.url === addition.url)).toHaveLength(1);
    });
    for (const field of ["deadline", "cost", "grades", "category", "url"] as const) {
      it(`${addition.id} preserves supplied ${field}`, () => {
        expect(allOpportunities.find((o) => o.id === addition.id)?.[field]).toEqual(addition[field]);
      });
    }
    it(`${addition.id} is online`, () => {
      expect(allOpportunities.find((o) => o.id === addition.id)?.format).toBe("Online");
    });
  }
});