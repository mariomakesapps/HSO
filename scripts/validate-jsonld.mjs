/**
 * Structural checks on the JSON-LD in every built page (raw HTML).
 *
 *   node scripts/validate-jsonld.mjs [distDir]
 *
 * Fails (exit 1) when:
 *  - a block is not valid JSON, or lacks a schema.org @context or an @type;
 *  - a URL field is not an absolute https URL;
 *  - an opportunity page carries Article markup (it is not an article) or its
 *    EducationalOccupationalProgram lacks name, url or provider;
 *  - a BreadcrumbList's positions are not 1..n, or a crumb name is not shown in
 *    the page's visible breadcrumb trail;
 *  - a FAQPage question or answer is not visible text on the page;
 *  - the homepage Organization lacks name, alternateName, url, logo or a sameAs;
 *  - /about has no AboutPage.
 * This is structure only; Google's Rich Results Test is still the final word.
 */
import fs from "node:fs";
import path from "node:path";
import { builtPages, bodyOf, bodyText, decode } from "./lib-dist.mjs";

const distDir = path.resolve(process.argv[2] ?? "dist");
const errors = [];
const typeCounts = new Map();
const URL_KEYS = new Set(["url", "item", "logo", "mainEntityOfPage", "sameAs", "target"]);

function checkUrls(route, node, where = "") {
  if (Array.isArray(node)) return node.forEach((n, i) => checkUrls(route, n, `${where}[${i}]`));
  if (!node || typeof node !== "object") return;
  for (const [k, v] of Object.entries(node)) {
    if (URL_KEYS.has(k)) {
      for (const u of Array.isArray(v) ? v : [v]) {
        if (typeof u === "string" && !/^https:\/\//.test(u)) errors.push(`${route}: ${where}.${k} is not an absolute https URL: ${u}`);
      }
    }
    if (typeof v === "object") checkUrls(route, v, `${where}.${k}`);
  }
}

const norm = (s) => decode(String(s)).replace(/\s+/g, " ").trim().toLowerCase();

for (const { route, file } of builtPages(distDir)) {
  const html = fs.readFileSync(file, "utf8");
  const blocks = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  const text = norm(bodyText(html));
  const crumbNav = bodyOf(html).match(/<nav aria-label="Breadcrumb"[\s\S]*?<\/nav>/)?.[0];
  const crumbText = crumbNav ? norm(crumbNav.replace(/<[^>]+>/g, " ")) : null;
  const types = [];

  for (const raw of blocks) {
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      errors.push(`${route}: invalid JSON-LD (${e.message})`);
      continue;
    }
    const type = data["@type"];
    types.push(type);
    typeCounts.set(type, (typeCounts.get(type) ?? 0) + 1);
    if (!/^https?:\/\/schema\.org\/?$/.test(data["@context"] ?? "")) errors.push(`${route}: ${type} missing schema.org @context`);
    if (!type) errors.push(`${route}: block without @type`);
    checkUrls(route, data, type);

    if (type === "BreadcrumbList") {
      const items = data.itemListElement ?? [];
      items.forEach((it, i) => {
        if (it.position !== i + 1) errors.push(`${route}: breadcrumb position ${it.position} at index ${i}`);
        if (crumbText === null) errors.push(`${route}: BreadcrumbList but no visible breadcrumb trail`);
        else if (!crumbText.includes(norm(it.name))) errors.push(`${route}: breadcrumb "${it.name}" not in the visible trail`);
      });
    }
    if (type === "FAQPage") {
      for (const q of data.mainEntity ?? []) {
        if (!text.includes(norm(q.name))) errors.push(`${route}: FAQ question not visible: "${q.name}"`);
        if (!text.includes(norm(q.acceptedAnswer?.text ?? "").slice(0, 80))) errors.push(`${route}: FAQ answer not visible for "${q.name}"`);
      }
    }
    if (type === "EducationalOccupationalProgram") {
      for (const k of ["name", "url"]) if (!data[k]) errors.push(`${route}: program missing ${k}`);
      if (!data.provider?.name) errors.push(`${route}: program missing provider.name`);
      if (data.applicationDeadline && !/^\d{4}-\d\d-\d\d$/.test(data.applicationDeadline)) errors.push(`${route}: bad applicationDeadline`);
    }
    if (type === "Organization" && route === "/") {
      for (const k of ["name", "alternateName", "url", "logo", "sameAs"]) if (!data[k]) errors.push(`/: Organization missing ${k}`);
    }
  }

  if (route.startsWith("/opportunities/") && types.includes("Article")) errors.push(`${route}: Article markup on an opportunity page`);
  if (route === "/" && !types.includes("Organization")) errors.push("/: no Organization markup");
  if (route === "/about" && !types.includes("AboutPage")) errors.push("/about: no AboutPage markup");
}

console.log(`[validate-jsonld] ${[...typeCounts].map(([t, n]) => `${t} ${n}`).join(" · ")}`);
if (errors.length) {
  console.error(`  ERRORS (${errors.length}):\n    ${errors.slice(0, 40).join("\n    ")}`);
  process.exit(1);
}
console.log("  all JSON-LD blocks valid.");
