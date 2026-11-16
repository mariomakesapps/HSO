import { detailFor } from "@/data/opportunityDetails";

/**
 * Lookups over the "last changed" table built by listingDates.ts.
 *
 * Kept apart from that file because it imports every dated update file just to
 * read their keys. Production client builds load the finished table as JSON
 * instead (hso-precompiled-catalogue plugin in vite.config.ts) and use these same
 * functions, so pages never download the update files themselves.
 */
export function makeListingDates(lastChanged: Record<string, string>) {
  function listingLastModified(id: string): string | undefined {
    const fromUpdates = Object.prototype.hasOwnProperty.call(lastChanged, id) ? lastChanged[id] : undefined;
    const checked = detailFor(id)?.source.checked;
    if (!checked) return fromUpdates;
    if (!fromUpdates) return checked;
    return checked > fromUpdates ? checked : fromUpdates;
  }

  /** Latest date among these listings, for hub pages that list them. */
  function latestLastModified(ids: Iterable<string>): string | undefined {
    let latest: string | undefined;
    for (const id of ids) {
      const d = listingLastModified(id);
      if (d && (!latest || d > latest)) latest = d;
    }
    return latest;
  }

  return { listingLastModified, latestLastModified };
}
