import { describe, expect, it } from "vitest";
import { allOpportunities } from "@/data/opportunities";
import { opportunityFaqs, opportunityMeta } from "@/lib/pageMeta";
import { datesText, keyFacts, listingFaqs } from "@/lib/listingFacts";

const today = "2026-10-28";
const base = { title: "Test Program", cost: "Free" as const, grades: [10, 11], location: "Boston, Massachusetts, USA", format: "In-person" as const };

describe("listing key facts and FAQ", () => {
  it("never says just TBA and never shows a passed deadline as upcoming", () => {
    expect(datesText({ ...base, deadline: null, opensAt: null }, today)).toBe(
      "No date is posted for the 2026-27 cycle yet. Check the official page for when applications open.",
    );
    expect(datesText({ ...base, deadline: "2026-10-01", opensAt: null }, today)).toContain("has passed");
    expect(datesText({ ...base, deadline: "2027-01-15", opensAt: "2026-12-01" }, today)).toBe(
      "Applications open December 1, 2026 and close January 15, 2027.",
    );
  });

  it("answers cost questions without amounts", () => {
    const paid = listingFaqs({ ...base, cost: "Paid", deadline: null, opensAt: null }, today);
    expect(paid[1].a.startsWith("No.")).toBe(true);
    expect(paid.map((f) => f.a).join(" ")).not.toMatch(/\$\d/);
    expect(keyFacts({ ...base, deadline: null, opensAt: null }, today)[0].value).toBe(
      "High school students in grades 10 to 11. It takes place in person in Boston, Massachusetts.",
    );
  });

  it("FAQPage JSON-LD matches the FAQ the page shows, for every listing", () => {
    for (const opp of allOpportunities) {
      const ld = opportunityMeta(opp).jsonLd?.find((j) => j["@type"] === "FAQPage") as { mainEntity: { name: string }[] };
      expect(ld.mainEntity.map((q) => q.name)).toEqual(opportunityFaqs(opp).map((f) => f.q));
    }
  });
});
