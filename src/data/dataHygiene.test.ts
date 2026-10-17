import { describe, expect, it } from "vitest";
import { repairTruncation } from "@/data/dataHygiene";

describe("truncation detection", () => {
  it("preserves terminal punctuation after a trailing preposition", () => {
    expect(repairTruncation("Choose an issue you care about.")).toBe("Choose an issue you care about.");
  });
  it("still removes an incomplete dangling fragment", () => {
    expect(repairTruncation("Students complete a research project with")).toBe("Students complete a research project.");
  });
});