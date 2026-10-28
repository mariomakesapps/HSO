/**
 * Sitemap generator.
 *
 * The committed sitemap listed every opportunity id, including listings the
 * detail page marks noindex (missing core fields, broken or placeholder links,
 * flagged for review). Submitting a URL and then telling Google not to index it
 * burns crawl budget on ~3,300 URLs and shows up as "Excluded by noindex tag".
 * This regenerates the sitemap from the same quality gate the pages use, so the
 * two can never disagree.
 */
import { build } from "esbuild";
import fs from "node:fs/promises";
import path from "node:path";
import { importBundle } from "./prerender.mjs";

const SITE_URL = "https://highschoolopportunity.org";

/** Crawl priority by route type — flat priorities give Google nothing to act on. */
const PRIORITY = {
  home: { priority: "1.0", changefreq: "daily" },
  category: { priority: "0.9", changefreq: "weekly" },
  guide: { priority: "0.8", changefreq: "monthly" },
  opportunity: { priority: "0.6", changefreq: "weekly" },
  page: { priority: "0.4", changefreq: "monthly" },
};

function classify(routePath) {
  if (routePath === "/") return "home";
  if (routePath === "/deadlines") return "category";
  if (routePath.startsWith("/categories/")) return "category";
  if (routePath.startsWith("/guides/")) return "guide";
  if (routePath.startsWith("/opportunities/")) return "opportunity";
  return "page";
}

async function loadRoutes(root) {
  const result = await build({
    stdin: {
      contents: `export { allRoutes } from "@/lib/pageMeta";`,
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

  const mod = await importBundle(result);
  return mod.allRoutes();
}

const escapeXml = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c],
  );

/**
 * Which child sitemap a route belongs to. Category hubs, deadlines, remote and
 * NYC are the hubs; everything else that isn't a listing, guide or collection is
 * a plain page.
 */
function sitemapFile(routePath) {
  if (routePath.startsWith("/opportunities/")) return "opportunities";
  if (routePath.startsWith("/guides/")) return "guides";
  if (routePath === "/collections" || routePath.startsWith("/collections/")) return "collections";
  if (
    routePath.startsWith("/categories/") ||
    ["/deadlines", "/remote", "/nyc-programs-for-high-school-students"].includes(routePath)
  )
    return "categories";
  return "pages";
}

const FILES = ["pages", "categories", "guides", "collections", "opportunities"];

const latest = (dates) => dates.filter(Boolean).sort().at(-1);

export async function generateSitemap({ root, distDir }) {
  const routes = await loadRoutes(root);

  // Only advertise URLs we actually want indexed: never noindex, removed or redirected pages.
  const indexable = routes.filter((r) => !r.noindex);

  const groups = Object.fromEntries(FILES.map((f) => [f, []]));
  for (const r of indexable) groups[sitemapFile(r.path)].push(r);

  const outputs = {};
  for (const file of FILES) {
    const body = groups[file]
      .map((r) => {
        const { priority, changefreq } = PRIORITY[classify(r.path)];
        // <lastmod> only where the page's content has a real change date.
        const lastmod = r.lastmod ? `<lastmod>${r.lastmod}</lastmod>` : "";
        return `  <url><loc>${escapeXml(SITE_URL + r.path)}</loc>${lastmod}<changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
      })
      .join("\n");
    outputs[`sitemap-${file}.xml`] =
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
  }

  // sitemap.xml becomes the index, so the URL already submitted to Search Console
  // and named in robots.txt keeps working.
  const index = FILES.map((file) => {
    const lastmod = latest(groups[file].map((r) => r.lastmod));
    return `  <sitemap><loc>${SITE_URL}/sitemap-${file}.xml</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</sitemap>`;
  }).join("\n");
  outputs["sitemap.xml"] =
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${index}\n</sitemapindex>\n`;

  // Write to both public/ (so it stays in version control) and dist/.
  for (const [name, xml] of Object.entries(outputs)) {
    await fs.writeFile(path.join(root, "public", name), xml, "utf8");
    if (distDir) {
      await fs.mkdir(distDir, { recursive: true });
      await fs.writeFile(path.join(distDir, name), xml, "utf8");
    }
  }

  return {
    total: routes.length,
    indexable: indexable.length,
    excluded: routes.length - indexable.length,
    withLastmod: indexable.filter((r) => r.lastmod).length,
    files: Object.fromEntries(FILES.map((f) => [f, groups[f].length])),
  };
}
