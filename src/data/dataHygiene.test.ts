import { describe, expect, it } from "vitest";
import { americanSpelling, repairTruncation, usDates, withMainSubjects } from "@/data/dataHygiene";

describe("truncation detection", () => {
  it("preserves terminal punctuation after a trailing preposition", () => {
    expect(repairTruncation("Choose an issue you care about.")).toBe("Choose an issue you care about.");
  });
  it("still removes an incomplete dangling fragment", () => {
    expect(repairTruncation("Students complete a research project with")).toBe("Students complete a research project.");
  });
});
describe("American spelling in blurbs", () => {
  it("uses U.S. spelling for common British forms", () => {
    expect(americanSpelling("A free programme at a learning centre; dual enrolment is offered.")).toBe(
      "A free program at a learning center; dual enrollment is offered.",
    );
    expect(americanSpelling("Organised by the state bar.")).toBe("Organized by the state bar.");
  });
  it("leaves proper names with a capital letter alone", () => {
    expect(americanSpelling("Held at Centre College.")).toBe("Held at Centre College.");
  });
});

describe("U.S. date order in blurbs", () => {
  it("rewrites day-first dates", () => {
    expect(usDates("Chapters must pay state dues by 1 March 2027.")).toBe("Chapters must pay state dues by March 1, 2027.");
    expect(usDates("Held 04 December 2026 and 17 April 2027.")).toBe("Held December 4, 2026 and April 17, 2027.");
  });
  it("leaves U.S.-order dates alone", () => {
    expect(usDates("Due March 1, 2027.")).toBe("Due March 1, 2027.");
  });
});

describe("main subject tags", () => {
  it("adds the main subject a specific tag belongs to", () => {
    expect(withMainSubjects(["Physics"])).toEqual(["Physics", "STEM"]);
    expect(withMainSubjects(["Music", "Arts"])).toEqual(["Music", "Arts"]);
    expect(withMainSubjects(["Health", "Civic Leadership"])).toEqual(["Health", "Civic Leadership", "Medicine", "Leadership"]);
  });
});
