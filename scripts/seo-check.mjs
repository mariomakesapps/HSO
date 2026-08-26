/**
 * Post-build SEO assertions.
 *
 * The failure this guards against is silent: if the prerender step stops
 * splicing content correctly, the build still succeeds and every page quietly
 * ships the same generic <head> again — which is the exact state that left the
 * site averaging position 48. Run after `vite build`.
 *
 *   npm run seo:check
 */
import fs from "node:fs";
import path from "node:path";

const distDir = path.resolve(process.cwd(), "dist");

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, acc);
    else if (entry.name === "index.html") acc.push(p);
  }
  return acc;
}

if (!fs.existsSync(distDir)) {
  console.error("dist/ not found — run `vite build` first.");
  process.exit(1);
}

const files = walk(distDir);
const titles = new Map();
const canonicals = new Map();
const problems = [];

for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const route = "/" + path.relative(distDir, path.dirname(file)).split(path.sep).join("/");

  const title = html.match(/<title[^>]*>([^<]*)<\/title>/)?.[1];
  const canonical = html.match(/<link [^>]*rel="canonical" href="([^"]*)"/)?.[1];
  const description = html.match(/<meta [^>]*name="description" content="([^"]*)"/)?.[1];
  const h1 = html.match(/<h1>([^<]*)<\/h1>/)?.[1];

  if (!title) problems.push(`${route}: missing <title>`);
  if (!canonical) problems.push(`${route}: missing canonical`);
  if (!description) problems.push(`${route}: missing meta description`);
  if (!h1) problems.push(`${route}: missing <h1>`);

  // Regression guard: react-helmet-async only replaces head tags marked
  // data-rh="true". Drop the marker and every page hydrates with two
  // canonicals, two descriptions and doubled JSON-LD.
  if (canonical && !/<link data-rh="true" rel="canonical"/.test(html)) {
    problems.push(`${route}: canonical is missing the data-rh marker (Helmet will duplicate it)`);
  }
  // Guard against a host that answers every path with the root index.html.
  if (!html.includes("link[rel=\\\"canonical\\\"]") && !html.includes('rel="canonical"]')) {
    problems.push(`${route}: SPA-fallback canonical guard script is missing`);
  }

  if (title) titles.set(title, (titles.get(title) ?? 0) + 1);
  if (canonical) canonicals.set(canonical, (canonicals.get(canonical) ?? 0) + 1);
}

const dupCanonicals = [...canonicals.entries()].filter(([, n]) => n > 1);
const dupTitles = [...titles.entries()].filter(([, n]) => n > 1);

for (const [href, n] of dupCanonicals) {
  problems.push(`canonical used by ${n} pages: ${href}`);
}

console.log(`pages checked:        ${files.length}`);
console.log(`unique titles:        ${titles.size}`);
console.log(`unique canonicals:    ${canonicals.size}`);
if (dupTitles.length) {
  console.log(`\nduplicate titles (${dupTitles.length}) — listings sharing a name:`);
  for (const [t, n] of dupTitles.slice(0, 20)) console.log(`  ${n}x  ${t}`);
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems.slice(0, 40)) console.error(`  - ${p}`);
  process.exit(1);
}

console.log("\nAll pages have a unique canonical, a title, a description and an h1.");
