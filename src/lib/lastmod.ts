import { hsoAdditionsSep2026, hsoDeadlineReviewSep2026 } from "@/data/hsoUpdateSep2026";
import { hsoAdditionsOct2026, hsoReviewOct2026 } from "@/data/hsoUpdateOct2026";
import { OPPORTUNITY_DETAILS } from "@/data/opportunityDetails";

/**
 * The date a listing's facts were last checked against its official page, from
 * the dated review records. Used for <lastmod> in the sitemap.
 *
 * Only dates that record a check are read: the start of an evidence entry
 * ("2026-09-16: ...") or a date after "checked", "fetched", "re-checked" and the
 * like. Deadline dates quoted inside the evidence are not check dates and are
 * ignored. A review row with no dated check falls back to the day that review
 * ran. Listings no review touched return undefined; the sitemap generator then
 * uses the date their source file last changed in git.
 */
const CHECK_DATE =
  /(?:^|\|\s*|\b(?:checked|fetched|re-checked|rechecked|corroborated|read in a browser on|confirmed|shortened|updated|verified|reviewed)\b[^0-9|]{0,25})(20\d\d-\d\d-\d\d)\b/gi;

/** The day each review ran, per its file header. */
const SEP_REVIEW_DATE = "2026-09-15";
const SEP_ADDITIONS_DATE = "2026-09-22";
const OCT_REVIEW_DATE = "2026-10-07";

function checkDates(evidence: string | undefined): string[] {
  if (!evidence) return [];
  return [...evidence.matchAll(CHECK_DATE)].map((m) => m[1]);
}

let cache: Map<string, string> | null = null;

function build(): Map<string, string> {
  const dates = new Map<string, string[]>();
  const add = (id: string, ...ds: string[]) => {
    const list = dates.get(id) ?? [];
    list.push(...ds);
    dates.set(id, list);
  };

  for (const o of hsoAdditionsSep2026) add(o.id, SEP_ADDITIONS_DATE);
  for (const [id, row] of Object.entries(hsoDeadlineReviewSep2026)) {
    add(id, SEP_REVIEW_DATE, ...checkDates(row.evidence));
  }
  for (const o of hsoAdditionsOct2026) add(o.id, OCT_REVIEW_DATE);
  for (const [id, row] of Object.entries(hsoReviewOct2026)) {
    add(id, OCT_REVIEW_DATE, ...checkDates(row.evidence));
  }
  for (const [id, d] of Object.entries(OPPORTUNITY_DETAILS)) {
    if (/^\d{4}-\d\d-\d\d$/.test(d.source.checked)) add(id, d.source.checked);
  }

  const out = new Map<string, string>();
  for (const [id, list] of dates) out.set(id, list.sort().at(-1)!);
  return out;
}

/** Latest dated check for a listing (YYYY-MM-DD), never later than `today`. */
export function reviewDateFor(id: string, today: string): string | undefined {
  cache ??= build();
  const d = cache.get(id);
  if (!d) return undefined;
  return d > today ? today : d;
}
