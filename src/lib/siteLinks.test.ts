import { describe, expect, it } from "vitest";
import { SOCIAL_LINKS } from "@/lib/siteLinks";
import { STATIC_PAGE_META } from "@/lib/pageMeta";

describe("social links", () => {
  it("are clean https profile URLs with no tracking parameters", () => {
    for (const s of SOCIAL_LINKS) {
      expect(s.href).toMatch(/^https:\/\/www\.(instagram|linkedin)\.com\/[^?#]+$/);
    }
  });
  it("are listed as the Organization's sameAs", () => {
    const org = STATIC_PAGE_META["/"].jsonLd?.find((j) => j["@type"] === "Organization");
    expect(org?.sameAs).toEqual(SOCIAL_LINKS.map((s) => s.href));
  });
});
