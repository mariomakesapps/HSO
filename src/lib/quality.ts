import { allOpportunities, type Opportunity } from "@/data/opportunities";
import { detailFor } from "@/data/opportunityDetails";
import { reviewDateFor } from "@/lib/lastmod";

/**
 * A page-quality score for an opportunity listing, from the fields it really
 * has. Nothing here adds content; it only measures what is there, so a thin or
 * boilerplate listing can be kept out of the index (noindex,follow) instead of
 * diluting the site.
 *
 * The threshold lives in src/config/seo.ts. scripts/quality-report.mjs prints
 * every score with its reasons.
 */
export interface QualityResult {
  score: number;
  /** One entry per signal, "+2 precise official link", "-3 boilerplate description", ... */
  reasons: string[];
}

/**
 * Descriptions that are import boilerplate rather than a description: the same
 * text on 3+ listings, or the same opening (digits ignored) on 5+ listings, which
 * catches templated rows like "Official NYC DYCD youth opportunity listing.
 * Program type: ... Site: ... Contact: ...".
 */
const blurbKey = (b: string) => b.trim().toLowerCase();
const templateKey = (b: string) => blurbKey(b).replace(/[0-9]+/g, "#").slice(0, 80);

function countBy(keyOf: (o: Opportunity) => string): Map<string, number> {
  const counts = new Map<string, number>();
  for (const o of allOpportunities) {
    const k = keyOf(o);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return counts;
}

const BLURB_COUNTS = countBy((o) => blurbKey(o.blurb));
const TEMPLATE_COUNTS = countBy((o) => templateKey(o.blurb));

/** An official link whose page (query string ignored) 3+ listings share: a directory or dataset, not this program's page. */
const urlKey = (u: string) => u.split(/[?#]/)[0].replace(/\/+$/, "").toLowerCase();
const URL_COUNTS = countBy((o) => urlKey(o.url));

export function isBoilerplateBlurb(opp: Opportunity): boolean {
  return (BLURB_COUNTS.get(blurbKey(opp.blurb)) ?? 0) >= 3 || (TEMPLATE_COUNTS.get(templateKey(opp.blurb)) ?? 0) >= 5;
}

export function hasSharedLink(opp: Opportunity): boolean {
  return (URL_COUNTS.get(urlKey(opp.url)) ?? 0) >= 3;
}

export function qualityScore(opp: Opportunity, today = new Date().toISOString().slice(0, 10)): QualityResult {
  const reasons: string[] = [];
  let score = 0;
  const add = (n: number, why: string) => {
    score += n;
    reasons.push(`${n > 0 ? "+" : ""}${n} ${why}`);
  };

  const blurb = opp.blurb.trim();
  if (isBoilerplateBlurb(opp)) add(-4, "boilerplate description shared with other listings");
  else if (blurb.length >= 200) add(3, "description 200+ chars");
  else if (blurb.length >= 100) add(2, "description 100+ chars");
  else if (blurb.length >= 50) add(1, "description 50+ chars");

  const precision = opp.link_precision ?? "";
  if (hasSharedLink(opp)) add(-1, "official link is a page 3+ other listings share");
  else if (precision === "direct_application_page" || precision === "exact_program_page" || opp.link_quality === "exact_program") {
    add(2, "link goes to the program's own page");
  } else if (opp.link_quality === "category_page" || precision === "broad_directory") {
    add(1, "link goes to a section page");
  } else if (opp.link_quality === "generic_homepage" || precision === "generic_homepage") {
    add(-1, "link goes to a generic homepage");
  }

  if (opp.deadline || opp.opensAt) add(1, "dated deadline or opening");
  if (opp.grades.length > 0 && opp.grades.length < 4) add(1, "specific grade range");
  else if (opp.grades.length === 4) add(1, "grades 9-12");
  if (opp.location && !/^(usa|online, usa)$/i.test(opp.location.trim())) add(1, "specific location");
  else if (opp.location) add(1, "nationwide/online location");
  if (opp.fields.length > 0) add(1, "subject fields");
  if (opp.verified) add(1, "official page checked by hand");
  if (reviewDateFor(opp.id, today)) add(1, "dated review record");
  if (detailFor(opp.id)) add(2, "long-form verified details");

  return { score, reasons };
}
