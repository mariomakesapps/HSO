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
import path from "node:path";

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
  return import(
    `data:text/javascript;base64,${Buffer.from(code, "utf8").toString("base64")}`
  );
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
        export { allRoutes, opportunityMeta, categoryMeta, remoteMeta, STATIC_PAGE_META,
                 isOpportunityIndexable } from "@/lib/pageMeta";
        export { REMOTE_META, remoteOpportunities } from "@/lib/remote";
        export { allOpportunities } from "@/data/opportunities";
        export { CATEGORY_META, CATEGORY_SLUGS } from "@/lib/categories";
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
      ? `<meta ${RH} name="robots" content="noindex,nofollow" />`
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

function shell(inner) {
  return `<div style="${HIDDEN}">\n${inner}\n      </div>`;
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

  const related = data.allOpportunities
    .filter((o) => o.id !== opp.id && o.category === opp.category)
    .slice(0, 8)
    .map((o) => ({ href: `/opportunities/${o.id}`, label: o.title }));

  return shell(`        <h1>${escapeHtml(opp.title)}</h1>
        <p>${escapeHtml(opp.blurb)}</p>
        <p>Offered by ${escapeHtml(opp.org)}. ${escapeHtml(opp.category)} for high school students in ${escapeHtml(opp.location)}. Format: ${escapeHtml(opp.format)}. Cost: ${escapeHtml(opp.cost)}. ${escapeHtml(grades)}. ${escapeHtml(deadline)}</p>
        <p>Fields: ${escapeHtml((opp.fields ?? []).join(", "))}</p>
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
        <h2>Programs (${list.length})</h2>
        ${linkList(list.slice(0, 200).map((o) => ({ href: `/opportunities/${o.id}`, label: o.title })))}
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
function remoteBody(data) {
  const meta = data.REMOTE_META;
  const list = data.remoteOpportunities();

  return shell(`        <h1>${escapeHtml(meta.h1)}</h1>
        <p>${escapeHtml(meta.intro)}</p>
        <h2>Why remote and nationwide programs matter</h2>
        ${meta.guide.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n        ")}
        <h2>Remote and nationwide programs (${list.length})</h2>
        ${linkList(list.slice(0, 200).map((o) => ({ href: `/opportunities/${o.id}`, label: o.title })))}
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

function staticBody(meta, data) {
  return shell(`        <h1>${escapeHtml(meta.title.replace(/\s*\|\s*HSO.*$/, ""))}</h1>
        <p>${escapeHtml(meta.description ?? "")}</p>
        <h2>Browse opportunities by category</h2>
        ${linkList(
          data.CATEGORY_SLUGS.map((s) => ({
            href: `/categories/${s}`,
            label: data.CATEGORY_META[s].h1,
          })),
        )}
        <h2>Explore the site</h2>
        ${linkList([
          { href: "/", label: "Home — find opportunities" },
          { href: "/about", label: "About HSO" },
          { href: "/collections", label: "Collections — curated HSO opportunity lists" },
          { href: "/guides/top-medical-internships", label: "Best medical internships for high school students" },
          { href: "/guides/top-research-competitions", label: "Best research competitions for high schoolers" },
          { href: "/guides/top-business-summer-programs", label: "Best business summer programs for high schoolers" },
          { href: "/guides/high-school-law-internships", label: "High school law internships" },
          { href: "/submit", label: "Submit an opportunity" },
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

export async function prerender({ root, distDir }) {
  const templatePath = path.join(distDir, "index.html");
  const template = await fs.readFile(templatePath, "utf8");
  const data = await loadRouteData(root);

  const pages = [];

  for (const [routePath, meta] of Object.entries(data.STATIC_PAGE_META)) {
    pages.push({ meta, body: staticBody(meta, data) });
  }
  pages.push({ meta: data.remoteMeta(), body: remoteBody(data) });
  for (const slug of data.CATEGORY_SLUGS) {
    pages.push({ meta: data.categoryMeta(slug), body: categoryBody(slug, data) });
  }
  for (const opp of data.allOpportunities) {
    pages.push({ meta: data.opportunityMeta(opp), body: opportunityBody(opp, data) });
  }

  let written = 0;
  let noindexed = 0;

  for (const { meta, body } of pages) {
    const html = renderPage(template, headFor(meta), body);
    const outPath =
      meta.path === "/"
        ? path.join(distDir, "index.html")
        : path.join(distDir, meta.path, "index.html");

    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, html, "utf8");
    written++;
    if (meta.noindex) noindexed++;
  }

  return { written, noindexed, indexable: written - noindexed };
}
