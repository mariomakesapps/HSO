import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { allOpportunities } from "@/data/opportunities";
import { GUIDE_PROGRAM_LISTINGS, listingForGuideProgram } from "@/components/GuideProgramName";

const guideSources = readdirSync(path.resolve(__dirname, "../pages"))
  .filter((f) => f.startsWith("Guide") && f.endsWith(".tsx"))
  .map((f) => readFileSync(path.resolve(__dirname, "../pages", f), "utf8"))
  .join("\n");
const guideNames = [...guideSources.matchAll(/name: "([^"]+)"/g)].map((m) => m[1]);
const ids = new Set(allOpportunities.map((o) => o.id));

describe("guide programme links", () => {
  it("every mapped programme name is still in a guide", () => {
    for (const name of Object.keys(GUIDE_PROGRAM_LISTINGS)) expect(guideNames).toContain(name);
  });

  it("every linked listing still exists in the catalogue", () => {
    const linked = guideNames.map(listingForGuideProgram).filter(Boolean) as string[];
    expect(linked.length).toBeGreaterThanOrEqual(11);
    for (const id of linked) expect(ids.has(id), id).toBe(true);
  });
});
