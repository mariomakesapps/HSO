import { describe, expect, it } from "vitest";
import { listingDescription, listingTitle, nameMentionsOrg, orgShortName, programName } from "@/lib/listingSeo";

const today = "2026-10-28";

describe("listing SEO templates", () => {
  it("adds the org when the programme name doesn't say it (Treasury)", () => {
    const t = listingTitle(
      { title: "Headquarters Student Internship Program", org: "U.S. Department of the Treasury", deadline: null, opensAt: null },
      { reviewedTitle: "Headquarters Student Internship Program 2026-27 | HSO", today },
    );
    expect(t).toContain("(U.S. Treasury)");
    expect(t.endsWith(" | HSO")).toBe(true);
  });

  it("puts the next deadline and its year in the title", () => {
    const t = listingTitle(
      { title: "USAFA Summer Seminar", org: "United States Air Force Academy", deadline: "2027-01-15", opensAt: null },
      { today },
    );
    // The org name is too long to add (over 28 characters), so it is left out.
    expect(t).toBe("USAFA Summer Seminar 2027: Deadline Jan 15 | HSO");
  });

  it("uses the opening date while applications are not open yet", () => {
    const t = listingTitle(
      { title: "Susan Thompson Buffett Foundation Scholarship", org: "Susan Thompson Buffett Foundation", deadline: "2027-02-01", opensAt: "2026-11-01" },
      { today },
    );
    expect(t).toContain("Opens Nov 1");
    expect(t).not.toContain("(Susan Thompson");
  });

  it("never shows a deadline that has passed", () => {
    const t = listingTitle({ title: "Duke Math Meet", org: "Duke University Mathematics Union", deadline: "2026-10-25", opensAt: null }, { today });
    expect(t).toBe("Duke Math Meet: Eligibility & Cost | HSO");
  });

  it("drops a stale reviewed name in favour of the current title", () => {
    expect(programName({ title: "Science Communication Internship Program" }, "Science and Nature Program 2026 Deadline | HSO")).toBe(
      "Science Communication Internship Program",
    );
    expect(programName({ title: "High School Internship Program" }, "High School Internship Program - Lockheed Martin 2026 Deadline | HSO")).toBe(
      "High School Internship Program - Lockheed Martin",
    );
  });

  it("shortens orgs and recognises names that already include them", () => {
    expect(orgShortName("Army Educational Outreach Program (AEOP)")).toBe("AEOP");
    expect(nameMentionsOrg("Caltech Math Meet", "Caltech")).toBe(true);
    expect(nameMentionsOrg("Research Science Institute", "MIT / CEE")).toBe(false);
  });

  it("writes a facts-first description under 155 characters without inventing prices", () => {
    const d = listingDescription(
      {
        blurb: "Free summer research program run by CEE at MIT. Students take a week of STEM classes, then do a five-week research internship.",
        cost: "Free",
        grades: [11],
        location: "Cambridge, Massachusetts, USA",
        format: "In-person",
        deadline: "2026-12-11",
        opensAt: null,
      },
      today,
    );
    expect(d.startsWith("Free. Grade 11. Cambridge, Massachusetts. Apply by Dec 11, 2026.")).toBe(true);
    expect(d.length).toBeLessThanOrEqual(155);
    expect(d).not.toMatch(/\$/);
  });
});
