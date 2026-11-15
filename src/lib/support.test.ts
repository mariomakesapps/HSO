import { describe, expect, it } from "vitest";
import {
  DONATE_URL,
  SPONSORS,
  SPONSOR_TIERS,
  footerSponsors,
  sponsorProblems,
  sponsorsByTier,
  type Sponsor,
} from "@/lib/support";

const s = (over: Partial<Sponsor>): Sponsor => ({ name: "Acme", tier: "sponsor", since: "2026-11-15", ...over });

describe("donation link", () => {
  it("points at HSO's HCB donation page over https", () => {
    expect(DONATE_URL).toBe("https://hcb.hackclub.com/donations/start/high-school-opportunity");
  });
});

describe("sponsor list", () => {
  it("has no invalid entries", () => {
    for (const sp of SPONSORS) expect(sponsorProblems(sp), sp.name).toEqual([]);
  });
  it("flags bad links, logos, notes and dates", () => {
    expect(sponsorProblems(s({ url: "http://acme.com" }))).toContain("url must be an https link");
    expect(sponsorProblems(s({ logo: "acme.png" }))).toContain("logo must be under /sponsors/ or an https URL");
    expect(sponsorProblems(s({ note: "Hi" }))).toContain("only partners get a note");
    expect(sponsorProblems(s({ since: "Nov 2026" }))).toContain("since must be YYYY-MM-DD");
    expect(sponsorProblems(s({ url: "https://acme.com", logo: "/sponsors/acme.svg" }))).toEqual([]);
  });
  it("groups highest tier first and newest first, skipping empty tiers", () => {
    const groups = sponsorsByTier([
      s({ name: "Old", tier: "sponsor", since: "2026-01-01" }),
      s({ name: "New", tier: "sponsor", since: "2026-06-01" }),
      s({ name: "Big", tier: "partner" }),
    ]);
    expect(groups.map((g) => g.tier.id)).toEqual(["partner", "sponsor"]);
    expect(groups[1].sponsors.map((x) => x.name)).toEqual(["New", "Old"]);
  });
  it("shows only partners with a link in the footer", () => {
    const list = [s({ tier: "partner", url: "https://a.org" }), s({ tier: "partner" }), s({ url: "https://b.org" })];
    expect(footerSponsors(list)).toHaveLength(1);
  });
  it("defines every tier once", () => {
    expect(new Set(SPONSOR_TIERS.map((t) => t.id)).size).toBe(SPONSOR_TIERS.length);
  });
});
