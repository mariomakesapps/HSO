import { describe, expect, it } from "vitest";
import { allOpportunities } from "@/data/opportunities";
import { deadlineCheckOct2026 } from "@/data/deadlineCheckOct2026";
import { descriptionCheckOct2026 } from "@/data/descriptionCheckOct2026";
import { REMOVED_OPPORTUNITY_IDS } from "@/data/removedOpportunities";

const ids = new Set(allOpportunities.map((o) => o.id));
const byId = new Map(allOpportunities.map((o) => [o.id, o]));

describe("October review rows", () => {
  // A rewritten blurb can trip the catalogue's US-only filter (it scans text for
  // places like "Canada") and silently drop an indexed listing.
  it("never drop a listing out of the catalogue", () => {
    const missing = [...Object.keys(deadlineCheckOct2026), ...Object.keys(descriptionCheckOct2026)].filter((id) => !ids.has(id) && !REMOVED_OPPORTUNITY_IDS.has(id));
    expect(missing).toEqual([]);
  });

  it("are applied as written", () => {
    for (const [id, row] of Object.entries(descriptionCheckOct2026)) {
      const o = byId.get(id);
      if (!o) continue; // removed on purpose (and redirected)
      if (row.blurb && !deadlineCheckOct2026[id]?.blurb) expect([id, o.blurb]).toEqual([id, row.blurb]);
      if (row.cost) expect([id, o.cost]).toEqual([id, row.cost]);
      if (row.format) expect([id, o.format]).toEqual([id, row.format]);
      if (row.grades) expect([id, o.grades]).toEqual([id, row.grades]);
    }
  });

  it("keep dates out of rewritten descriptions (deadlines live in their own fields)", () => {
    const dated = Object.entries(descriptionCheckOct2026).filter(([, r]) => r.blurb && /\b20\d\d\b/.test(r.blurb)).map(([id]) => id);
    expect(dated).toEqual([]);
  });
});
