/**
 * Build-time prerenderer.
 *
 * The app is a client-rendered SPA, which meant every one of the ~3,300 URLs
 * served byte-identical HTML: the same generic <title>, the same meta
 * description, no canonical, and no page content until React booted. Googlebot
 * had to render JavaScript before it could tell any two pages apart.
 *
 * This walks every known route and writes a real HTML file per URL with the
 * correct <head> and a crawlable content block, so the raw response is already
 * unique and complete. React still takes over on mount and replaces the
 * container's children, exactly as it does today.
 */
import { build } from "esbuild";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SITE_URL = "https://highschoolopportunity.org";

/**
 * Import an esbuild in-memory result as a module.
 *
 * Nothing is written to disk: hosted build environments (Lovable, CI images)
 * may mount the project read-only or prune node_modules/.cache between steps,
 * and a prerender that depends on scratch files fails there for no good reason.
 */
export function importBundle(result) {
  const code = result.outputFiles[0].text;
  const file = path.join(os.tmpdir(), `hso-prerender-${crypto.randomUUID()}.mjs`);
  return fs.writeFile(file, code, "utf8")
    .then(() => import(pathToFileURL(file).href))
    .finally(() => fs.rm(file, { force: true }));
}

/**
 * The route metadata lives in TypeScript under src/ and imports through the
 * "@/" alias, so bundle it to a throwaway ESM module Node can import directly.
 * This keeps a single source of truth rather than duplicating title and
 * description strings in the build script.
 */
async function loadRouteData(root) {
  const result = await build({
    stdin: {
      contents: `
        export { allRoutes, opportunityMeta, categoryMeta, remoteMeta, deadlinesMeta, STATIC_PAGE_META,
                 isOpportunityIndexable } from "@/lib/pageMeta";
        export { REMOTE_META, remoteOpportunities } from "@/lib/remote";
        export { DEADLINES_META, deadlineBuckets } from "@/lib/deadlines";
        export { allOpportunities } from "@/data/opportunities";
        export { CATEGORY_META, CATEGORY_SLUGS } from "@/lib/categories";
        export { REMOVED_OPPORTUNITY_REDIRECTS } from "@/data/removedOpportunities";
        export { nycMeta } from "@/lib/pageMeta";
        export { NYC_META, nycAfterSchoolByBorough, nycFeatured } from "@/lib/nyc";
        export { detailFor } from "@/data/opportunityDetails";
        export { relatedOpportunities } from "@/lib/related";
        export { collectionMeta, collectionMembers, subHubMeta, subHubMembers } from "@/lib/pageMeta";
        export { SUB_HUBS, CATEGORY_GUIDES, subHubPath, subHubsFor } from "@/lib/subHubs";
        export { hubStats, glanceParagraphs, hubFaqs } from "@/lib/hubStats";
        export { opportunityFaqs } from "@/lib/pageMeta";
        export { keyFacts, monthYear } from "@/lib/listingFacts";
        export { todayIso } from "@/lib/listingSeo";
        export { listingLastModified } from "@/data/listingDates";
        export { curatedSections, curatedCollections } from "@/data/curatedCollections";
        export { HUB_LINKS, GUIDE_LINKS } from "@/lib/siteLinks";
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

/**
 * The guide pages keep their content (comparison tables, write-ups, FAQs) in the
 * React components, so render those components to HTML here rather than copying
 * the text into this script. Uses React's browser server renderer, which needs no
 * Node streams, and returns the JSON-LD the page sets through Helmet so the
 * prerendered head carries the same Article markup the app adds.
 */
const GUIDE_COMPONENTS = {
  "/guides/top-medical-internships": "GuideTopMedicalInternships",
  "/guides/top-research-competitions": "GuideTopResearchCompetitions",
  "/guides/top-business-summer-programs": "GuideTopBusinessPrograms",
  "/guides/high-school-law-internships": "GuideHighSchoolLawInternships",
};

async function loadGuideRenderer(root) {
  const imports = Object.values(GUIDE_COMPONENTS)
    .map((name) => `import ${name} from "@/pages/${name}";`)
    .join("\n");
  const table = Object.entries(GUIDE_COMPONENTS)
    .map(([route, name]) => `${JSON.stringify(route)}: ${name}`)
    .join(", ");
  const result = await build({
    stdin: {
      contents: `
        import { createElement } from "react";
        import { renderToStaticMarkup } from "react-dom/server.browser";
        import { MemoryRouter } from "react-router-dom";
        import { HelmetProvider } from "react-helmet-async";
        ${imports}
        const GUIDES = { ${table} };
        export function renderGuide(route) {
          const context = {};
          const html = renderToStaticMarkup(
            createElement(HelmetProvider, { context },
              createElement(MemoryRouter, { initialEntries: [route] }, createElement(GUIDES[route]))),
          );
          return { html, scripts: context.helmet ? context.helmet.script.toString() : "" };
        }
      `,
      resolveDir: root,
      loader: "tsx",
    },
    bundle: true,
    format: "esm",
    platform: "node",
    target: "node18",
    jsx: "automatic",
    write: false,
    logLevel: "error",
    define: { "process.env.NODE_ENV": '"production"' },
    alias: { "@": path.join(root, "src") },
  });
  return importBundle(result);
}

const ESCAPE_MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ESCAPE_MAP[c]);

/** JSON-LD sits inside a <script> block, so only </script> needs neutralising. */
const escapeJsonLd = (obj) =>
  JSON.stringify(obj).replace(/</g, "\\u003c").replace(/>/g, "\\u003e");

function headFor(meta) {
  const url = `${SITE_URL}${meta.path}`;
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description ?? "");
  const image = `${SITE_URL}/og-image.jpg`;

  // Every tag below is also managed by react-helmet-async at runtime. Helmet
  // only clears tags it recognises as its own — those carrying data-rh="true",
  // the same marker its server renderer emits. Without it, Helmet appends a
  // second copy on mount and each page ends up with two canonicals, two
  // descriptions and doubled JSON-LD.
  const RH = `data-rh="true"`;

  const tags = [
    `<title ${RH}>${title}</title>`,
    `<meta ${RH} name="description" content="${description}" />`,
    `<link ${RH} rel="canonical" href="${escapeHtml(url)}" />`,
    meta.noindex
      ? // noindex,follow: kept out of the index, but its links still count.
        `<meta ${RH} name="robots" content="noindex,follow" />`
      : `<meta ${RH} name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />`,
    `<meta ${RH} property="og:type" content="website" />`,
    `<meta ${RH} property="og:site_name" content="HSO" />`,
    `<meta ${RH} property="og:url" content="${escapeHtml(url)}" />`,
    `<meta ${RH} property="og:title" content="${title}" />`,
    `<meta ${RH} property="og:description" content="${description}" />`,
    `<meta ${RH} property="og:image" content="${image}" />`,
    `<meta ${RH} property="og:image:width" content="1200" />`,
    `<meta ${RH} property="og:image:height" content="630" />`,
    `<meta ${RH} name="twitter:card" content="summary_large_image" />`,
    `<meta ${RH} name="twitter:title" content="${title}" />`,
    `<meta ${RH} name="twitter:description" content="${description}" />`,
    `<meta ${RH} name="twitter:image" content="${image}" />`,
  ];

  for (const schema of meta.jsonLd ?? []) {
    tags.push(`<script ${RH} type="application/ld+json">${escapeJsonLd(schema)}</script>`);
  }

  tags.push(FALLBACK_GUARD);

  return tags.join("\n    ");
}

/**
 * Safety net for hosts that answer every path with the root index.html instead
 * of resolving <route>/index.html (a blanket SPA rewrite).
 *
 * Without this, such a host would serve the HOMEPAGE's canonical on every URL —
 * actively telling Google that all 1,800 pages duplicate the homepage, which is
 * worse than shipping no canonical at all. The guard notices that the document
 * it is running in describes a different URL than the one requested, repairs the
 * canonical from the address bar, and drops the structured data that describes
 * the wrong page. React and Helmet then set the real values a moment later.
 *
 * On a correctly-resolving host the comparison matches and this does nothing.
 */
const FALLBACK_GUARD = `<script>(function(){try{
var l=document.querySelector('link[rel="canonical"]');if(!l)return;
var p=location.pathname.replace(/\\/+$/,'')||'/';
var here=${JSON.stringify(SITE_URL)}+(p==='/'?'/':p);
if(l.getAttribute('href')===here)return;
l.setAttribute('href',here);
var d=document.querySelectorAll('script[type="application/ld+json"]');
for(var i=0;i<d.length;i++)d[i].parentNode.removeChild(d[i]);
}catch(e){}})();</script>`;

/**
 * Content shipped inside #root. React's createRoot().render() discards these
 * children on mount, so this is purely what a crawler sees pre-render — the
 * same approach the existing index.html already used for the homepage. It is
 * visually hidden to avoid a flash of unstyled content before hydration.
 */
const HIDDEN =
  "position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;padding:0;margin:-1px;";

/**
 * Links to every hub and guide, appended to every prerendered page the way the
 * site footer appears on every rendered one. Built once in prerender() so the
 * category, hub and guide lists come from the same source as the app.
 */
let SITE_LINKS_HTML = "";

function siteLinksHtml(data) {
  return `
        <h2>Browse HSO</h2>
        ${linkList([
          ...data.CATEGORY_SLUGS.map((s) => ({ href: `/categories/${s}`, label: data.CATEGORY_META[s].h1 })),
          ...data.HUB_LINKS,
          ...data.GUIDE_LINKS,
        ])}`;
}

function shell(inner) {
  return `<div style="${HIDDEN}">\n${inner}${SITE_LINKS_HTML}\n      </div>`;
}

function linkList(items) {
  return `<ul>${items
    .map((i) => `<li><a href="${escapeHtml(i.href)}">${escapeHtml(i.label)}</a></li>`)
    .join("")}</ul>`;
}

function opportunityBody(opp, data) {
  const grades = opp.grades?.length
    ? `Grades ${opp.grades[0]}–${opp.grades[opp.grades.length - 1]}`
    : "Grades 9–12";
  const deadline = opp.deadline ? `Deadline: ${opp.deadline}.` : "Deadline: rolling or not yet announced.";
  const slug = data.CATEGORY_SLUGS.find(
    (s) => data.CATEGORY_META[s].category === opp.category,
  );

  // Same ranking as the listing page: same category, shared subjects, same state.
  const related = data
    .relatedOpportunities(opp, 8)
    .map((o) => ({ href: `/opportunities/${o.id}`, label: o.title }));

  // Long-form copy, where we have it. Only a handful of listings carry this today;
  // it is what turns a ~150-word page into one that can hold a position-1 ranking.
  const d = data.detailFor(opp.id);
  const detail = !d
    ? ""
    : `
        <h2>About this program</h2>
        ${d.body.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n        ")}
        ${d.eligibility ? `<h2>Who it is for</h2><p>${escapeHtml(d.eligibility)}</p>` : ""}
        ${d.cost ? `<h2>Cost</h2><p>${escapeHtml(d.cost)}</p>` : ""}
        ${
          d.howToApply?.length
            ? `<h2>How to apply</h2><ul>${d.howToApply
                .map((x) => `<li>${escapeHtml(x)}</li>`)
                .join("")}</ul>`
            : ""
        }
        ${
          d.faqs?.length
            ? `<h2>Frequently asked questions</h2>${d.faqs
                .map((f) => `<h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p>`)
                .join("")}`
            : ""
        }
        <p>Details checked on ${escapeHtml(d.source.checked)} against <a href="${escapeHtml(d.source.url)}">the program's own page</a>.</p>`;

  const crumbs = `<nav aria-label="Breadcrumb"><a href="/">Home</a> / ${
    slug ? `<a href="/categories/${slug}">${escapeHtml(data.CATEGORY_META[slug].h1)}</a> / ` : ""
  }${escapeHtml(opp.title)}</nav>`;

  return shell(`        ${crumbs}
        <h1>${escapeHtml(opp.title)}</h1>
        <p>${escapeHtml(opp.blurb)}</p>
        <p>Offered by ${escapeHtml(opp.org)}. ${escapeHtml(opp.category)} for high school students in ${escapeHtml(opp.location)}. Format: ${escapeHtml(opp.format)}. Cost: ${escapeHtml(opp.cost)}. ${escapeHtml(grades)}. ${escapeHtml(deadline)}</p>
        <p>Fields: ${escapeHtml((opp.fields ?? []).join(", "))}</p>
        <h2>Key facts</h2>
        <dl>${data
          .keyFacts(opp, data.todayIso())
          .map((f) => `<dt>${escapeHtml(f.label)}</dt><dd>${escapeHtml(f.value)}</dd>`)
          .join("")}</dl>
        ${(() => {
          const checked = data.listingLastModified(opp.id);
          return checked ? `<p>Info checked ${escapeHtml(data.monthYear(checked))}.</p>` : "";
        })()}${detail}
        ${
          d?.faqs?.length
            ? ""
            : `<h2>Questions about ${escapeHtml(opp.title)}</h2>
        ${data
          .opportunityFaqs(opp)
          .map((f) => `<h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p>`)
          .join("\n        ")}`
        }
        <p><a href="${escapeHtml(opp.url)}">Official program page</a></p>
        ${slug ? `<p><a href="/categories/${slug}">More ${escapeHtml(data.CATEGORY_META[slug].h1.toLowerCase())}</a></p>` : ""}
        <h2>Related opportunities</h2>
        ${linkList(related)}`);
}

function categoryBody(slug, data) {
  const meta = data.CATEGORY_META[slug];
  const list = data.allOpportunities.filter((o) => o.category === meta.category);

  return shell(`        <h1>${escapeHtml(meta.h1)}</h1>
        <p>${escapeHtml(meta.intro)}</p>
        <h2>About ${escapeHtml(meta.h1.toLowerCase())}</h2>
        ${meta.guide.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n        ")}
        ${data
          .glanceParagraphs(meta.h1.replace(/ for high school students$/i, "").toLowerCase(), data.hubStats(list))
          .map((p) => `<p>${escapeHtml(p)}</p>`)
          .join("\n        ")}
        ${
          data.subHubsFor(slug).length || (data.CATEGORY_GUIDES[slug] ?? []).length
            ? `<h2>Browse by subject</h2>
        ${linkList([
          ...data.subHubsFor(slug).map((h) => ({ href: data.subHubPath(h), label: h.h1 })),
          ...(data.CATEGORY_GUIDES[slug] ?? []),
        ])}`
            : ""
        }
        <h2>Programs (${list.length})</h2>
        ${linkList(
          // Every indexable listing, so none is left without a link in the HTML;
          // noindexed rows stay in the app's list but get no link from here.
          list.filter((o) => data.isOpportunityIndexable(o)).map((o) => ({ href: `/opportunities/${o.id}`, label: o.title })),
        )}
        <h2>Frequently asked questions</h2>
        ${meta.faqs
          .map((f) => `<h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p>`)
          .join("\n        ")}
        <h2>Browse more categories</h2>
        ${linkList(
          data.CATEGORY_SLUGS.filter((s) => s !== slug).map((s) => ({
            href: `/categories/${s}`,
            label: data.CATEGORY_META[s].h1,
          })),
        )}`);
}

/**
 * The remote / nationwide view spans every category, so it gets its own body
 * rather than the generic static-page one — it is the page that serves students
 * in the states this catalogue barely covers, and it needs real crawlable
 * content to rank for "online competitions" and "remote internships".
 */
function deadlinesBody(data) {
  const meta = data.DEADLINES_META;
  const buckets = data.deadlineBuckets();
  const parts = [];

  parts.push("        <h1>" + escapeHtml(meta.h1) + "</h1>");
  parts.push("        <p>" + escapeHtml(meta.intro) + "</p>");

  for (const bucket of buckets) {
    parts.push(
      "        <h2>" + escapeHtml(bucket.title) + " (" + bucket.items.length + ")</h2>",
    );
    parts.push("        <p>" + escapeHtml(bucket.blurb) + "</p>");
    parts.push(
      "        " +
        linkList(
          bucket.items.slice(0, 200).map((o) => ({
            href: "/opportunities/" + o.id,
            label: o.title + " - " + o.org + (o.deadline ? " (closes " + o.deadline + ")" : ""),
          })),
        ),
    );
  }

  parts.push("        <h2>How to use a deadline list</h2>");
  for (const p of meta.guide) parts.push("        <p>" + escapeHtml(p) + "</p>");
  parts.push("        <h2>Frequently asked questions</h2>");
  for (const f of meta.faqs) {
    parts.push("        <h3>" + escapeHtml(f.q) + "</h3><p>" + escapeHtml(f.a) + "</p>");
  }
  parts.push("        <h2>Browse by category</h2>");
  parts.push(
    "        " +
      linkList(
        data.CATEGORY_SLUGS.map((s) => ({
          href: "/categories/" + s,
          label: data.CATEGORY_META[s].h1,
        })),
      ),
  );

  return shell(parts.join("\n"));
}

function remoteBody(data) {
  const meta = data.REMOTE_META;
  const list = data.remoteOpportunities();

  return shell(`        <h1>${escapeHtml(meta.h1)}</h1>
        <p>${escapeHtml(meta.intro)}</p>
        <h2>Why remote and nationwide programs matter</h2>
        ${meta.guide.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n        ")}
        <h2>Remote and nationwide programs (${list.length})</h2>
        ${linkList(
          // Every indexable listing, so none is left without a link in the HTML;
          // noindexed rows stay in the app's list but get no link from here.
          list.filter((o) => data.isOpportunityIndexable(o)).map((o) => ({ href: `/opportunities/${o.id}`, label: o.title })),
        )}
        <h2>Frequently asked questions</h2>
        ${meta.faqs.map((f) => `<h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p>`).join("\n        ")}
        <h2>Browse by category</h2>
        ${linkList(
          data.CATEGORY_SLUGS.map((s) => ({
            href: `/categories/${s}`,
            label: data.CATEGORY_META[s].h1,
          })),
        )}`);
}

function collectionsIndexBody(meta, data) {
  return shell(`        <h1>Curated collections</h1>
        <p>${escapeHtml(meta.description ?? "")}</p>
        ${data.curatedSections
          .map(
            (section) => `<h2>${escapeHtml(section.title)}</h2>
        ${linkList(
          section.collections.map((c) => ({
            href: `/collections/${c.id}`,
            label: `${c.title}: ${c.description} (${data.collectionMembers(c).length} programs)`,
          })),
        )}`,
          )
          .join("\n        ")}`);
}

function collectionBody(c, data) {
  const members = data.collectionMembers(c);
  const items = members
    .map(
      (o) =>
        `<li><a href="/opportunities/${escapeHtml(o.id)}">${escapeHtml(o.title)}</a>: ${escapeHtml(o.org)}. ${escapeHtml(
          o.category,
        )}, ${escapeHtml(o.location)}. ${escapeHtml(o.blurb)}</li>`,
    )
    .join("");
  return shell(`        <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/collections">Collections</a> / ${escapeHtml(c.title)}</nav>
        <h1>${escapeHtml(c.title)}</h1>
        <p>${escapeHtml(c.description)}</p>
        <h2>Programs in this collection (${members.length})</h2>
        <ul>${items}</ul>
        <p><a href="/collections">Browse all curated collections</a></p>`);
}

function subHubBody(hub, data) {
  const parent = data.CATEGORY_META[hub.parent];
  const members = data.subHubMembers(hub);
  const stats = data.hubStats(members);
  return shell(`        <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/categories/${hub.parent}">${escapeHtml(parent.h1)}</a> / ${escapeHtml(hub.h1)}</nav>
        <h1>${escapeHtml(hub.h1)}</h1>
        ${hub.intro.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n        ")}
        <h2>At a glance</h2>
        ${data.glanceParagraphs(hub.label, stats).map((p) => `<p>${escapeHtml(p)}</p>`).join("\n        ")}
        ${hub.guide ? `<p><a href="${hub.guide.href}">${escapeHtml(hub.guide.label)}</a></p>` : ""}
        <h2>Programs (${members.length})</h2>
        ${linkList(members.map((o) => ({ href: `/opportunities/${o.id}`, label: o.title })))}
        <h2>Frequently asked questions</h2>
        ${data
          .hubFaqs(hub.label, stats)
          .map((f) => `<h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p>`)
          .join("\n        ")}
        <h2>More ${escapeHtml(parent.h1.toLowerCase())}</h2>
        ${linkList([
          { href: `/categories/${hub.parent}`, label: `All ${parent.h1.toLowerCase()}` },
          ...data.subHubsFor(hub.parent)
            .filter((h) => h.slug !== hub.slug)
            .map((h) => ({ href: data.subHubPath(h), label: h.h1 })),
        ])}`);
}

function staticBody(meta, data) {
  return shell(`        <h1>${escapeHtml(meta.title.replace(/\s*\|\s*HSO.*$/, ""))}</h1>
        <p>${escapeHtml(meta.description ?? "")}</p>
        <h2>Explore the site</h2>
        ${linkList([
          { href: "/", label: "Home — find opportunities" },
          { href: "/about", label: "About HSO" },
          { href: "/submit", label: "Submit an opportunity" },
          { href: "/volunteer", label: "Volunteer with HSO" },
          { href: "/donate", label: "Donate to or sponsor HSO" },
          { href: "/contact", label: "Contact & corrections" },
          { href: "/privacy", label: "Privacy policy" },
          { href: "/terms", label: "Terms of use" },
        ])}`);
}

const ROOT_OPEN = '<div id="root">';

/**
 * Strip the template's own head tags so they cannot compete with the per-page
 * ones, then splice in this route's head and body.
 */
function stripTemplateHead(template) {
  return template
    .replace(/<title>[\s\S]*?<\/title>\s*/i, "")
    .replace(/<meta\s+name="description"[^>]*>\s*/gi, "")
    .replace(
      /<meta\s+property="og:(?:type|title|description|image|image:width|image:height|image:alt|site_name)"[^>]*>\s*/gi,
      "",
    )
    .replace(/<meta\s+name="twitter:(?:card|title|description|image)"[^>]*>\s*/gi, "")
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, "");
}

/**
 * Replace the contents of #root by index rather than regex. Vite hoists the
 * module script into <head>, so there is no reliable trailing marker to anchor
 * a lazy match against — an earlier regex here silently left the template's
 * placeholder content on every page.
 */
function renderPage(template, head, body) {
  const stripped = stripTemplateHead(template);

  const headClose = stripped.indexOf("</head>");
  const rootStart = stripped.indexOf(ROOT_OPEN);
  const bodyClose = stripped.indexOf("</body>");
  if (headClose === -1 || rootStart === -1 || bodyClose === -1) {
    throw new Error("index.html template is missing </head>, #root, or </body>");
  }

  const rootContentStart = rootStart + ROOT_OPEN.length;
  const rootClose = stripped.lastIndexOf("</div>", bodyClose);
  if (rootClose < rootContentStart) {
    throw new Error("could not locate the closing </div> for #root");
  }

  const withHead =
    stripped.slice(0, headClose) + `  ${head}\n  ` + stripped.slice(headClose);

  // Head insertion shifted every later offset; recompute against the new string.
  const shift = withHead.length - stripped.length;
  return (
    withHead.slice(0, rootContentStart + shift) +
    body +
    withHead.slice(rootClose + shift)
  );
}

/**
 * The New York hub, crawlable.
 *
 * The 578 city after-school listings are noindexed individually, so this page is
 * the only place Google can see them. Linking every one of them here keeps them
 * discoverable and passes the internal links on to something that can rank,
 * which is the whole point of noindex,follow rather than removing them.
 */
function nycBody(data) {
  const featured = data.nycFeatured();
  const boroughs = data.nycAfterSchoolByBorough();
  const afterSchool = boroughs.reduce((n, g) => n + g.items.length, 0);
  const meta = data.NYC_META;

  return shell(`        <h1>${escapeHtml(meta.h1)}</h1>
        <p>${escapeHtml(meta.intro)}</p>
        <h2>Programs with their own application (${featured.length})</h2>
        ${linkList(
          featured.slice(0, 120).map((o) => ({ href: `/opportunities/${o.id}`, label: o.title })),
        )}
        <h2>Free city after-school programs (${afterSchool})</h2>
        ${boroughs
          .map(
            (g) => `<h3>${escapeHtml(g.borough)} (${g.items.length})</h3>
        ${linkList(g.items.map((o) => ({ href: `/opportunities/${o.id}`, label: o.title })))}`,
          )
          .join("\n        ")}
        <h2>How to use this page</h2>
        ${meta.guide.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n        ")}
        <h2>Frequently asked questions</h2>
        ${meta.faqs
          .map((f) => `<h3>${escapeHtml(f.q)}</h3><p>${escapeHtml(f.a)}</p>`)
          .join("\n        ")}
        <h2>Browse by category</h2>
        ${linkList(
          data.CATEGORY_SLUGS.map((s) => ({
            href: `/categories/${s}`,
            label: data.CATEGORY_META[s].h1,
          })),
        )}`);
}

/**
 * The page a genuinely unknown URL gets.
 *
 * It must not be the homepage. Every unresolved path used to fall through the
 * blanket `/* -> /index.html 200` rule, so a deleted programme answered 200 with
 * the homepage's title, the homepage's H1 and `robots: index,follow` — a soft 404
 * that Search Console reports as "Discovered, currently not indexed".
 */
function notFoundMeta() {
  return {
    path: "/404",
    title: "Page not found | HSO",
    description:
      "That page is not part of the HSO catalogue. Browse internships, summer programs, competitions, scholarships and research placements for high school students.",
    noindex: true,
  };
}

function notFoundBody(data) {
  return shell(`        <h1>Page not found</h1>
        <p>That page is not part of the HSO catalogue. It may have been a program that is no longer listed.</p>
        <h2>Browse by category</h2>
        ${linkList(
          data.CATEGORY_SLUGS.map((s) => ({
            href: `/categories/${s}`,
            label: data.CATEGORY_META[s].h1,
          })),
        )}
        <p><a href="/deadlines">See what closes next</a> or <a href="/">search the whole catalogue</a>.</p>`);
}

/**
 * Rewrite the deployed _redirects so removed programmes 301 at the edge and any
 * other unknown /opportunities/ path returns a real 404 instead of the SPA shell.
 *
 * Static files are matched before these rules on Cloudflare Pages and Netlify, so
 * every prerendered route still wins. The final catch-all is left in place: routes
 * that are legitimately client-only (/collections/:id, /profile, /auth) have no
 * prerendered file and must still boot the app.
 */
async function writeRedirects(distDir, data) {
  const entries = Object.entries(data.REMOVED_OPPORTUNITY_REDIRECTS ?? {});
  const lines = [
    "# Generated by scripts/prerender.mjs — edit src/data/removedOpportunities.ts, not this file.",
    "",
    "# Programmes that are no longer listed. Each one was indexed and some still rank,",
    "# so they move permanently to the listing that replaced them or to their category.",
    ...entries
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([id, target]) => `/opportunities/${id}  ${target}  301`),
    "",
    "# Any other unknown programme URL is not a page we have: answer 404, not 200.",
    "/opportunities/*  /404.html  404",
    "",
    "# Everything else still boots the SPA (client-only routes have no prerendered file).",
    "/*    /index.html   200",
    "",
  ];
  await fs.writeFile(path.join(distDir, "_redirects"), lines.join("\n"), "utf8");
  return entries.length;
}

export async function prerender({ root, distDir }) {
  const templatePath = path.join(distDir, "index.html");
  const template = await fs.readFile(templatePath, "utf8");
  const data = await loadRouteData(root);
  SITE_LINKS_HTML = siteLinksHtml(data);

  const pages = [];

  const guides = await loadGuideRenderer(root);
  for (const [routePath, meta] of Object.entries(data.STATIC_PAGE_META)) {
    if (GUIDE_COMPONENTS[routePath]) {
      const { html, scripts } = guides.renderGuide(routePath);
      pages.push({ meta, body: shell(html), extraHead: scripts });
    } else if (routePath === "/collections") {
      pages.push({ meta, body: collectionsIndexBody(meta, data) });
    } else {
      pages.push({ meta, body: staticBody(meta, data) });
    }
  }
  for (const hub of data.SUB_HUBS) {
    pages.push({ meta: data.subHubMeta(hub), body: subHubBody(hub, data) });
  }
  for (const c of data.curatedCollections) {
    pages.push({ meta: data.collectionMeta(c), body: collectionBody(c, data) });
  }
  pages.push({ meta: data.remoteMeta(), body: remoteBody(data) });
  pages.push({ meta: data.deadlinesMeta(), body: deadlinesBody(data) });
  pages.push({ meta: data.nycMeta(), body: nycBody(data) });
  for (const slug of data.CATEGORY_SLUGS) {
    pages.push({ meta: data.categoryMeta(slug), body: categoryBody(slug, data) });
  }
  for (const opp of data.allOpportunities) {
    pages.push({ meta: data.opportunityMeta(opp), body: opportunityBody(opp, data) });
  }

  let written = 0;
  let noindexed = 0;

  for (const { meta, body, extraHead } of pages) {
    const html = renderPage(template, headFor(meta) + (extraHead ? `\n  ${extraHead}` : ""), body);
    const outPath =
      meta.path === "/"
        ? path.join(distDir, "index.html")
        : path.join(distDir, meta.path, "index.html");

    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, html, "utf8");
    written++;
    if (meta.noindex) noindexed++;
  }

  // 404.html sits at the dist root, which is where both Cloudflare Pages and
  // Netlify look for it. It is deliberately not in `pages`: it must never reach
  // allRoutes() or the sitemap.
  const nf = notFoundMeta();
  await fs.writeFile(
    path.join(distDir, "404.html"),
    renderPage(template, headFor(nf), notFoundBody(data)),
    "utf8",
  );

  const redirects = await writeRedirects(distDir, data);

  return { written, noindexed, indexable: written - noindexed, redirects };
}
