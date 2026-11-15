/**
 * Donations and sponsors for the /donate page.
 *
 * Donations go through HCB (Hack Club's fiscal sponsorship platform). To recognize a
 * sponsor, add them to SPONSORS below. The /donate page lists everyone at the Supporter
 * tier and up, and the site footer also shows Partner-tier sponsors.
 */

export const DONATE_URL = "https://hcb.hackclub.com/donations/start/high-school-opportunity";
export const SPONSOR_EMAIL = "contact@highschoolopportunity.org";

export type SponsorTierId = "supporter" | "sponsor" | "partner";

export interface SponsorTier {
  id: SponsorTierId;
  name: string;
  /** Short label for the suggested amount, e.g. "$250+". */
  amount: string;
  recognition: string[];
}

/** Suggested sponsorship levels. Amounts and perks are HSO's own choice; edit freely. */
export const SPONSOR_TIERS: SponsorTier[] = [
  {
    id: "supporter",
    name: "Supporter",
    amount: "Any amount",
    recognition: ["Your name on this page, if you'd like it listed"],
  },
  {
    id: "sponsor",
    name: "Sponsor",
    amount: "$250+",
    recognition: ["Your logo and a link on this page", "A thank-you post on HSO's social accounts"],
  },
  {
    id: "partner",
    name: "Partner",
    amount: "$1,000+",
    recognition: [
      "Your logo and a link on this page and in the footer of every HSO page",
      "A thank-you post on HSO's social accounts",
      "A short note on what your organization offers students, on this page",
    ],
  },
];

export interface Sponsor {
  name: string;
  tier: SponsorTierId;
  /** Official website, https only. */
  url?: string;
  /** Logo path under /public (e.g. "/sponsors/acme.svg") or an https URL. */
  logo?: string;
  /** Partner tier only: one sentence on what they offer students. */
  note?: string;
  /** ISO date the sponsorship started, for ordering. */
  since: string;
}

/** Everyone who has asked to be recognized. Newest first within each tier. */
export const SPONSORS: Sponsor[] = [];

const TIER_RANK: Record<SponsorTierId, number> = { partner: 0, sponsor: 1, supporter: 2 };

/** Sponsors grouped by tier, highest tier first, newest first within a tier. */
export function sponsorsByTier(list: Sponsor[] = SPONSORS): { tier: SponsorTier; sponsors: Sponsor[] }[] {
  return [...SPONSOR_TIERS]
    .sort((a, b) => TIER_RANK[a.id] - TIER_RANK[b.id])
    .map((tier) => ({
      tier,
      sponsors: list.filter((s) => s.tier === tier.id).sort((a, b) => b.since.localeCompare(a.since)),
    }))
    .filter((g) => g.sponsors.length > 0);
}

/** Partner-tier sponsors for the site footer. */
export function footerSponsors(list: Sponsor[] = SPONSORS): Sponsor[] {
  return list.filter((s) => s.tier === "partner" && s.url).sort((a, b) => b.since.localeCompare(a.since));
}

/**
 * rel for links to sponsors. Google asks that paid links be marked "sponsored";
 * noopener/noreferrer because they open in a new tab.
 */
export const SPONSOR_LINK_REL = "sponsored noopener noreferrer";

/** Problems with a sponsor entry, so a bad edit fails the tests instead of shipping. */
export function sponsorProblems(s: Sponsor): string[] {
  const out: string[] = [];
  if (!s.name.trim()) out.push("missing name");
  if (!SPONSOR_TIERS.some((t) => t.id === s.tier)) out.push(`unknown tier ${s.tier}`);
  if (s.url && !/^https:\/\/[^\s/]+\.[^\s/]+/.test(s.url)) out.push("url must be an https link");
  if (s.logo && !/^(\/sponsors\/|https:\/\/)/.test(s.logo)) out.push("logo must be under /sponsors/ or an https URL");
  if (s.note && s.tier !== "partner") out.push("only partners get a note");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s.since)) out.push("since must be YYYY-MM-DD");
  return out;
}
