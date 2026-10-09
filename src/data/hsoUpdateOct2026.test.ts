import { describe, it, expect } from "vitest";
import { allOpportunities } from "@/data/opportunities";
import { normalizeOpportunityUrl } from "@/data/eligibilityCleanup.generated";
import { hsoAdditionsOct2026, hsoReviewOct2026 } from "@/data/hsoUpdateOct2026";
import { REMOVED_OPPORTUNITY_REDIRECTS } from "@/data/removedOpportunities";

const byId = new Map(allOpportunities.map((o) => [o.id, o]));

describe("HSO October 2026 update", () => {
  it("publishes every new listing, and none duplicates an existing id or URL", () => {
    for (const added of hsoAdditionsOct2026) {
      expect(byId.get(added.id), added.id).toBeDefined();
      const sameUrl = allOpportunities.filter(
        (o) => normalizeOpportunityUrl(o.url) === normalizeOpportunityUrl(added.url),
      );
      expect(sameUrl.map((o) => o.id), added.id).toEqual([added.id]);
    }
    expect(new Set(allOpportunities.map((o) => o.id)).size).toBe(allOpportunities.length);
  });

  it("keeps the category each new listing was filed under", () => {
    for (const added of hsoAdditionsOct2026) expect(byId.get(added.id)?.category, added.id).toBe(added.category);
  });

  it("applies the reviewed rows", () => {
    for (const [id, r] of Object.entries(hsoReviewOct2026)) if (!r.removed) expect(byId.get(id), id).toBeDefined();
    expect(byId.get("rsi")?.deadline).toBe("2026-12-11");
    expect(byId.get("dell")).toMatchObject({ deadline: "2027-01-12", opensAt: "2026-10-01" });
    expect(byId.get("horatio-alger")?.grades).toEqual([11]);
    expect(byId.get("fred-hutchinson-cancer-center-summer-high-school-internship-prog")?.grades).toEqual([11]);
    expect(byId.get("ill-mathematics")?.title).toBe("Stanford University Mathematics Camp (SUMaC)");
    expect(byId.get("congressional-award")?.category).toBe("Competition");
    expect(byId.get("nyo")).toMatchObject({ deadline: "2026-12-03", opensAt: "2026-09-10" });
    expect(byId.get("nyojazz")).toMatchObject({ deadline: "2027-01-18", opensAt: "2026-09-10" });
  });

  it("drops ended or replaced programs and redirects their old pages", () => {
    expect(byId.has("atlas-fellowship")).toBe(false);
    expect(byId.has("ayia")).toBe(false);
    expect(byId.has("yes-abroad-kennedy-lugar")).toBe(false);
    expect(REMOVED_OPPORTUNITY_REDIRECTS["yes-abroad-kennedy-lugar"]).toBe("/opportunities/flex-global-abroad");
    expect(byId.get("flex-global-abroad")?.deadline).toBe("2026-11-30");
  });

  it("only uses ISO dates", () => {
    for (const added of hsoAdditionsOct2026) {
      if (added.deadline) expect(added.deadline).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});
