import { describe, expect, it } from "vitest";
import { reclassifyCategory } from "@/data/opportunities";

describe("reclassifyCategory", () => {
  it("keeps a Scholarship whose text only uses the plural", () => {
    expect(
      reclassifyCategory("Scholarship", "MSPE Scholarships", "The society awards scholarships each year to graduating seniors."),
    ).toBe("Scholarship");
  });
  it("still turns a Scholarship with no money language into a Fellowship", () => {
    expect(reclassifyCategory("Scholarship", "Youth Leaders", "A year-long leadership program for teens.")).toBe("Fellowship");
  });
});
