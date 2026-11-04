import { describe, expect, it } from "vitest";
import { americanSpelling, repairTruncation } from "@/data/dataHygiene";

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
