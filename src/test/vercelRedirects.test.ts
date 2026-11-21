import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { REMOVED_OPPORTUNITY_REDIRECTS } from "@/data/removedOpportunities";

/**
 * Vercel ignores the generated _redirects file and reads redirects from
 * vercel.json, which the prerender step keeps in sync. Run `npm run build` and
 * commit vercel.json if this fails.
 */
describe("vercel.json", () => {
  const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../vercel.json"), "utf8"));

  it("is valid JSON with the SPA rewrite", () => {
    expect(config.rewrites?.[0]?.destination).toBe("/index.html");
  });

  it("permanently redirects every removed listing, like _redirects", () => {
    const expected = Object.entries(REMOVED_OPPORTUNITY_REDIRECTS)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([id, target]) => ({ source: `/opportunities/${id}`, destination: target, statusCode: 301 }));
    expect(config.redirects).toEqual(expected);
  });
});
