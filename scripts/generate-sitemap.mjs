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

export async function generateSitemap({ root, distDir }) {
  const routes = await loadRoutes(root);
  const lastmod = new Date().toISOString().slice(0, 10);

  // Only advertise URLs we actually want indexed.
  const indexable = routes.filter((r) => !r.noindex);

  const body = indexable
    .map((r) => {
      const { priority, changefreq } = PRIORITY[classify(r.path)];
      return `  <url><loc>${escapeXml(SITE_URL + r.path)}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

  // Write to both public/ (so it stays in version control) and dist/.
  await fs.writeFile(path.join(root, "public/sitemap.xml"), xml, "utf8");
  if (distDir) {
    await fs.mkdir(distDir, { recursive: true });
    await fs.writeFile(path.join(distDir, "sitemap.xml"), xml, "utf8");
  }

  return { total: routes.length, indexable: indexable.length, excluded: routes.length - indexable.length };
}
