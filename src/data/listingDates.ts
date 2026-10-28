import { OCT2026_ADDITIONS, OCT2026_FIXES, OCT14_DECISION_FIXES, OCT14_FIXES } from "@/data/hsoUpdateOct2026.generated";
import { OCT17_ADDITIONS, OCT17_FIXES } from "@/data/hsoUpdateOct17.generated";
import { OCT25_FIXES } from "@/data/hsoUpdateOct25.generated";
import { hsoAdditionsSep2026, hsoDeadlineReviewSep2026 } from "@/data/hsoUpdateSep2026";
import { detailFor } from "@/data/opportunityDetails";

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
];

const LAST_CHANGED = new Map<string, string>();
for (const [date, ids] of UPDATES) {
  for (const id of ids) if ((LAST_CHANGED.get(id) ?? "") < date) LAST_CHANGED.set(id, date);
}

export function listingLastModified(id: string): string | undefined {
  const fromUpdates = LAST_CHANGED.get(id);
  const checked = detailFor(id)?.source.checked;
  if (!checked) return fromUpdates;
  if (!fromUpdates) return checked;
  return checked > fromUpdates ? checked : fromUpdates;
}

/** Latest date among these listings, for hub pages that list them. */
export function latestLastModified(ids: Iterable<string>): string | undefined {
  let latest: string | undefined;
  for (const id of ids) {
    const d = listingLastModified(id);
    if (d && (!latest || d > latest)) latest = d;
  }
  return latest;
}
