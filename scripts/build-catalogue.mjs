/**
 * Runs the catalogue pipeline (src/data/opportunities.ts) once in Node and returns
 * the finished records as JSON, plus the "last changed" date table from
 * src/data/listingDates.ts.
 *
 * The pipeline merges the base list, every dated update and addition file, link
 * checks, location fixes and data hygiene. Shipping all of that to browsers meant
 * every visitor downloaded about 4.5 MB of JavaScript and rebuilt the same
 * catalogue on page load. Production builds instead embed the result of this
 * function (see the hso-precompiled-catalogue plugin in vite.config.ts), so the
 * browser gets the identical corrected records with none of the work.
 *
 * Same bundling approach as scripts/prerender.mjs, so the prerendered pages, the
 * sitemaps and the app all come from one run of the same code.
 */
import { build } from "esbuild";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { pathToFileURL } from "node:url";

export async function buildCatalogueJson({ root }) {
  const result = await build({
    stdin: {
      contents: `export { allOpportunities } from "@/data/opportunities";
                 export { LAST_CHANGED } from "@/data/listingDates";`,
      resolveDir: root,
      loader: "ts",
    },
    bundle: true,
    format: "esm",
    platform: "node",
    target: "node18",
    write: false,
    logLevel: "error",
    alias: { "@": path.join(root, "src") },
  });
  const file = path.join(os.tmpdir(), `hso-catalogue-${crypto.randomUUID()}.mjs`);
  await fs.writeFile(file, result.outputFiles[0].text, "utf8");
  try {
    const { allOpportunities, LAST_CHANGED } = await import(pathToFileURL(file).href);
    if (!Array.isArray(allOpportunities) || allOpportunities.length === 0) {
      throw new Error("catalogue pipeline returned no opportunities");
    }
    return { opportunities: JSON.stringify(allOpportunities), lastChanged: JSON.stringify({ ...LAST_CHANGED }) };
  } finally {
    await fs.rm(file, { force: true });
  }
}
