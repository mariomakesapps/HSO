/**
 * Sitemap generator: a sitemap index (/sitemap.xml) and three child sitemaps.
 *
 *   sitemap-pages.xml          home, about and the other static pages, guides, hubs
 *   sitemap-categories.xml     every category page, including /page/<n>
 *   sitemap-opportunities.xml  every indexable opportunity page
 *
 * Only indexable, self-canonical routes from allRoutes() go in, so the sitemap
 * and the pages' own robots tags can never disagree (scripts/check-sitemap.mjs
 * re-checks that against the built HTML).
 *
 * <lastmod> is the date the content last changed, never the build time:
 *   - an opportunity: the latest dated check in the review records
 *     (src/lib/lastmod.ts), else the date its source data file last changed in git;
 *   - a hub or category page: the newest <lastmod> of the listings it shows;
 *   - any other page: the date its page component last changed in git.
 * When none is known (no git history in the build environment) the tag is left
 * out rather than guessed.
 */
import { build } from "esbuild";
import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { importBundle } from "./prerender.mjs";

const SITE_URL = "https://highschoolopportunity.org";

/** Page component behind each static route, for its git date. */
const PAGE_SOURCES = {
  "/about": "src/pages/About.tsx",
  "/contact": "src/pages/Contact.tsx",
  "/privacy": "src/pages/Privacy.tsx",
  "/terms": "src/pages/Terms.tsx",
  "/submit": "src/pages/Submit.tsx",
  "/volunteer": "src/pages/Volunteer.tsx",
  "/collections": "src/pages/Collections.tsx",
  "/guides/top-medical-internships": "src/pages/GuideTopMedicalInternships.tsx",
  "/guides/top-research-competitions": "src/pages/GuideTopResearchCompetitions.tsx",
  "/guides/top-business-summer-programs": "src/pages/GuideTopBusinessPrograms.tsx",
  "/guides/high-school-law-internships": "src/pages/GuideHighSchoolLawInternships.tsx",
};

async function loadData(root) {
  const result = await build({
    stdin: {
      contents: `
        export { allRoutes, categoryListings, categoryPageCount } from "@/lib/pageMeta";
        export { allOpportunities } from "@/data/opportunities";
        export { CATEGORY_SLUGS } from "@/lib/categories";
        export { CATEGORY_PAGE_SIZE } from "@/config/seo";
        export { deadlineBuckets, DEADLINES_PATH } from "@/lib/deadlines";
        export { remoteOpportunities, REMOTE_PATH } from "@/lib/remote";
        export { nycOpportunities, NYC_PATH } from "@/lib/nyc";
        export { reviewDateFor } from "@/lib/lastmod";
      `,
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
  return importBundle(result);
}

/** Last commit date (YYYY-MM-DD) of a file, or undefined without git history. */
function gitDateFactory(root) {
  const cache = new Map();
  return (file) => {
    if (cache.has(file)) return cache.get(file);
    let d;
    try {
      d = execFileSync("git", ["log", "-1", "--format=%cs", "--", file], { cwd: root, encoding: "utf8" }).trim() || undefined;
    } catch {
      d = undefined;
    }
    cache.set(file, d);
    return d;
  };
}

/** Which data file defines each opportunity id (first definition wins). */
async function sourceFileIndex(root) {
  const dir = path.join(root, "src/data");
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".ts") && !f.endsWith(".test.ts"));
  // The base catalogue first, then additions; a later file only fills gaps.
  files.sort((a, b) => (a === "opportunities.ts" ? -1 : b === "opportunities.ts" ? 1 : a.localeCompare(b)));
  const index = new Map();
  for (const f of files) {
    const text = await fs.readFile(path.join(dir, f), "utf8");
    for (const m of text.matchAll(/(?:\bid|"id"):\s*"([^"]+)"/g)) {
      if (!index.has(m[1])) index.set(m[1], `src/data/${f}`);
    }
  }
  return index;
}

const maxDate = (dates) => dates.filter(Boolean).sort().at(-1);

const escapeXml = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c],
  );

function urlset(entries) {
  const body = entries
    .map(({ loc, lastmod }) =>
      `  <url><loc>${escapeXml(loc)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</url>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

function sitemapIndex(children) {
  const body = children
    .map(({ file, lastmod }) =>
      `  <sitemap><loc>${SITE_URL}/${file}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</sitemap>`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`;
}

export async function generateSitemap({ root, distDir }) {
  const data = await loadData(root);
  const today = new Date().toISOString().slice(0, 10);
  const gitDate = gitDateFactory(root);
  const sources = await sourceFileIndex(root);

  const oppDate = new Map();
  for (const o of data.allOpportunities) {
    const file = sources.get(o.id);
    oppDate.set(o.id, data.reviewDateFor(o.id, today) ?? (file ? gitDate(file) : undefined));
  }
  const newest = (items) => maxDate(items.map((o) => oppDate.get(o.id)));

  // Hubs and category pages change when what they list changes.
  const listDates = new Map();
  listDates.set("/", newest(data.allOpportunities));
  listDates.set(data.DEADLINES_PATH, newest(data.deadlineBuckets().flatMap((b) => b.items)));
  listDates.set(data.REMOTE_PATH, newest(data.remoteOpportunities()));
  listDates.set(data.NYC_PATH, newest(data.nycOpportunities()));
  for (const slug of data.CATEGORY_SLUGS) {
    const list = data.categoryListings(slug);
    for (let page = 1; page <= data.categoryPageCount(slug); page++) {
      const onPage = list.slice((page - 1) * data.CATEGORY_PAGE_SIZE, page * data.CATEGORY_PAGE_SIZE);
      const p = page === 1 ? `/categories/${slug}` : `/categories/${slug}/page/${page}`;
      listDates.set(p, newest(onPage));
    }
  }

  const routes = data.allRoutes();
  const indexable = routes.filter((r) => !r.noindex);
  const groups = { pages: [], categories: [], opportunities: [] };

  for (const r of indexable) {
    const loc = SITE_URL + r.path;
    if (r.path.startsWith("/opportunities/")) {
      groups.opportunities.push({ loc, lastmod: oppDate.get(r.path.slice("/opportunities/".length)) });
    } else if (r.path.startsWith("/categories/")) {
      groups.categories.push({ loc, lastmod: listDates.get(r.path) });
    } else {
      const src = PAGE_SOURCES[r.path];
      groups.pages.push({ loc, lastmod: listDates.get(r.path) ?? (src ? gitDate(src) : undefined) });
    }
  }

  const files = {
    "sitemap-pages.xml": groups.pages,
    "sitemap-categories.xml": groups.categories,
    "sitemap-opportunities.xml": groups.opportunities,
  };
  const outputs = {
    "sitemap.xml": sitemapIndex(
      Object.entries(files).map(([file, entries]) => ({ file, lastmod: maxDate(entries.map((e) => e.lastmod)) })),
    ),
  };
  for (const [file, entries] of Object.entries(files)) outputs[file] = urlset(entries);

  // Write to both public/ (so it stays in version control) and dist/.
  for (const [file, xml] of Object.entries(outputs)) {
    await fs.writeFile(path.join(root, "public", file), xml, "utf8");
    if (distDir) {
      await fs.mkdir(distDir, { recursive: true });
      await fs.writeFile(path.join(distDir, file), xml, "utf8");
    }
  }

  const withLastmod = Object.values(files).flat().filter((e) => e.lastmod).length;
  return {
    total: routes.length,
    indexable: indexable.length,
    excluded: routes.length - indexable.length,
    withLastmod,
  };
}
