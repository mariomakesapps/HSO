import { describe, expect, it } from "vitest";
import { SUB_HUBS, subHubPath } from "@/lib/subHubs";
import { allRoutes, subHubMembers, subHubMeta } from "@/lib/pageMeta";
import { hubFaqs, hubStats } from "@/lib/hubStats";

describe("subject sub-hubs", () => {
  // At least 10 indexable listings, enough for a useful page. Thinner topics are retired (RETIRED_SUB_HUBS).
  it("each has enough indexable listings to be worth a page", () => {
    for (const hub of SUB_HUBS) expect(subHubMembers(hub).length, subHubPath(hub)).toBeGreaterThanOrEqual(10);
  });

  it("each is a distinct, indexable route in allRoutes", () => {
    const routes = new Map(allRoutes().map((r) => [r.path, r]));
    const paths = SUB_HUBS.map(subHubPath);
    expect(new Set(paths).size).toBe(paths.length);
    for (const p of paths) {
      expect(routes.has(p), p).toBe(true);
      expect(routes.get(p)?.noindex).toBeFalsy();
    }
  });

  it("FAQPage JSON-LD matches the questions shown on the page", () => {
    for (const hub of SUB_HUBS) {
      const faq = subHubMeta(hub).jsonLd?.find((j) => j["@type"] === "FAQPage") as { mainEntity: { name: string }[] };
      const shown = hubFaqs(hub.label, hubStats(subHubMembers(hub))).map((f) => f.q);
      expect(faq.mainEntity.map((q) => q.name)).toEqual(shown);
    }
  });
});
