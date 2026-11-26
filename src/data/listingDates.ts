import { OCT2026_ADDITIONS, OCT2026_FIXES, OCT14_DECISION_FIXES, OCT14_FIXES } from "@/data/hsoUpdateOct2026.generated";
import { OCT17_ADDITIONS, OCT17_FIXES } from "@/data/hsoUpdateOct17.generated";
import { OCT25_FIXES } from "@/data/hsoUpdateOct25.generated";
import { OCT29_FIXES } from "@/data/hsoUpdateOct29.generated";
import { NOV03_FIXES } from "@/data/hsoUpdateNov03.generated";
import { NOV07_FIXES } from "@/data/hsoUpdateNov07.generated";
import { NOV15_FIXES } from "@/data/hsoUpdateNov15.generated";
import { NOV23_ADDED_IDS, NOV23_FIXES } from "@/data/hsoUpdateNov23.generated";
import { NOV26_FIXES } from "@/data/hsoUpdateNov26.generated";
import { NOV08_ADDITIONS } from "@/data/hsoAdditionsNov08.generated";
import { hsoAdditionsSep2026, hsoDeadlineReviewSep2026 } from "@/data/hsoUpdateSep2026";
import { makeListingDates } from "@/data/listingDatesModel";

/**
 * When each listing last really changed: the date the dated update that touched
 * it landed on main (git history of each update file), or the date its long-form
 * copy was checked against the official page. Used for <lastmod> in the sitemap
 * and dateModified in JSON-LD. A listing no dated update has touched has no date
 * rather than a made-up one (the build date would tell Google every page changed
 * on every deploy).
 */
const UPDATES: [string, Iterable<string>][] = [
  ["2026-09-20", [...hsoAdditionsSep2026.map((o) => o.id), ...Object.keys(hsoDeadlineReviewSep2026)]],
  ["2026-10-10", [...OCT2026_ADDITIONS.map((o) => o.id), ...Object.keys(OCT2026_FIXES)]],
  ["2026-10-14", [...Object.keys(OCT14_FIXES), ...Object.keys(OCT14_DECISION_FIXES)]],
  ["2026-10-17", [...OCT17_ADDITIONS.map((o) => o.id), ...Object.keys(OCT17_FIXES)]],
  ["2026-10-25", Object.keys(OCT25_FIXES)],
  ["2026-10-29", Object.keys(OCT29_FIXES)],
  ["2026-11-03", Object.keys(NOV03_FIXES)],
  ["2026-11-07", Object.keys(NOV07_FIXES)],
  ["2026-11-08", NOV08_ADDITIONS.map((o) => o.id)],
  ["2026-11-15", Object.keys(NOV15_FIXES)],
  ["2026-11-23", [...Object.keys(NOV23_FIXES), ...NOV23_ADDED_IDS]],
  ["2026-11-26", Object.keys(NOV26_FIXES)],
];

/** Listing id -> date of the latest dated update that touched it. */
export const LAST_CHANGED: Record<string, string> = Object.create(null);
for (const [date, ids] of UPDATES) {
  for (const id of ids) if ((LAST_CHANGED[id] ?? "") < date) LAST_CHANGED[id] = date;
}

export const { listingLastModified, latestLastModified } = makeListingDates(LAST_CHANGED);
