import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

/**
 * Emits a static HTML file per route and regenerates the sitemap after the
 * client bundle is written. Runs as a plugin rather than an npm postbuild
 * script so it happens on any `vite build`, including hosts that invoke Vite
 * directly instead of going through package.json scripts.
 */
function seoPrerenderPlugin(): Plugin {
  const root = __dirname;
  let isSsrBuild = false;
  return {
    name: "hso-seo-prerender",
    apply: "build",
    enforce: "post",
    configResolved(config) {
      // The prerenderer itself runs a second, SSR build of src/entry-server.tsx.
      // That inner build must not prerender again.
      isSsrBuild = !!config.build.ssr;
    },
    async closeBundle() {
      if (isSsrBuild) return;
      const distDir = path.resolve(root, "dist");
      try {
        const { prerender } = await import("./scripts/prerender.mjs");
        const { generateSitemap } = await import("./scripts/generate-sitemap.mjs");
        const { checkSitemap } = await import("./scripts/check-sitemap.mjs");

        const pages = await prerender({ root, distDir });
        const sitemap = await generateSitemap({ root, distDir });

        // Never ship a sitemap that sends Google to a noindexed, missing or
        // non-canonical URL.
        const check = await checkSitemap({ distDir });
        if (check.problems.length) {
          throw new Error(`sitemap check failed (${check.problems.length}):\n  ${check.problems.slice(0, 30).join("\n  ")}`);
        }

        this.info(
          `prerendered ${pages.written} pages (${pages.indexable} indexable, ${pages.noindexed} noindex) · sitemap index: ${sitemap.indexable} URLs, ${sitemap.withLastmod} with lastmod (${sitemap.excluded} noindex excluded) · 404.html + ${pages.redirects} permanent redirects · ${pages.ssrFailures} SSR fallbacks`,
        );
      } catch (err) {
        // A prerender failure must not silently ship an SPA-only build.
        this.error(`SEO prerender failed: ${(err as Error).stack ?? err}`);
      }
    },
  };
}

/**
 * Ships the finished catalogue to the browser instead of the pipeline that builds it.
 *
 * src/data/opportunities.ts assembles allOpportunities from the raw imports, every
 * dated review file (with its quoted evidence) and the link-check maps, then runs
 * the hygiene and location fixes. All of that used to download to every visitor
 * and run in their browser: a 3.1 MB chunk. This plugin runs the same pipeline
 * once at build time and gives the client build a module holding only the result,
 * so cards, filters and pages in the browser read exactly the records the
 * prerendered HTML, metadata and sitemap were built from (AGENTS.md).
 *
 * Client build only. The SSR prerender, the dev server and the tests import the
 * real modules. src/lib/lastmod.ts is snapshotted the same way, because it reads
 * the review files only to find each listing's "last checked" date.
 */
function catalogSnapshotPlugin(): Plugin {
  const root = __dirname;
  const targets: Record<string, string> = {
    [path.resolve(root, "src/data/opportunities.ts")]: "\0hso-catalog",
    [path.resolve(root, "src/lib/lastmod.ts")]: "\0hso-lastmod",
  };
  // Never read in the browser, so not worth shipping.
  const DROP = new Set(["link_quality_score", "link_precision_score", "review_note"]);
  let isSsrBuild = false;
  let snapshot: Promise<{ catalog: string; lastmod: string }> | null = null;

  async function build() {
    const { build: esbuild } = await import("esbuild");
    const { importBundle } = await import("./scripts/prerender.mjs");
    const result = await esbuild({
      stdin: {
        contents: `export { allOpportunities } from "@/data/opportunities"; export { reviewDateFor } from "@/lib/lastmod";`,
        resolveDir: root,
        loader: "ts",
      },
      bundle: true,
      format: "esm",
      platform: "node",
      write: false,
      logLevel: "error",
      alias: { "@": path.resolve(root, "src") },
    });
    const m = await importBundle(result);
    const records = m.allOpportunities.map((o: Record<string, unknown>) =>
      Object.fromEntries(Object.entries(o).filter(([k, v]) => !DROP.has(k) && v !== undefined)),
    );
    const dates: [string, string][] = [];
    for (const o of m.allOpportunities) {
      const d = m.reviewDateFor(o.id, "9999-12-31");
      if (d) dates.push([o.id, d]);
    }
    const locations = JSON.stringify(path.resolve(root, "src/data/locations.ts"));
    return {
      // JSON.parse of a string literal parses faster than the same object literal.
      catalog: `export { locationState, locationStates } from ${locations};
export const allOpportunities = JSON.parse(${JSON.stringify(JSON.stringify(records))});
`,
      lastmod: `const DATES = new Map(JSON.parse(${JSON.stringify(JSON.stringify(dates))}));
export function reviewDateFor(id, today) {
  const d = DATES.get(id);
  if (!d) return undefined;
  return d > today ? today : d;
}
`,
    };
  }

  return {
    name: "hso-catalog-snapshot",
    apply: "build",
    enforce: "pre",
    configResolved(config) {
      isSsrBuild = !!config.build.ssr;
    },
    async resolveId(source, importer, options) {
      if (isSsrBuild || options?.ssr || source.startsWith("\0")) return null;
      if (!/opportunities|lastmod/.test(source)) return null;
      const resolved = await this.resolve(source, importer, { ...options, skipSelf: true });
      return resolved ? targets[resolved.id.split("?")[0]] ?? null : null;
    },
    async load(id) {
      if (id !== "\0hso-catalog" && id !== "\0hso-lastmod") return null;
      snapshot ??= build();
      const { catalog, lastmod } = await snapshot;
      return id === "\0hso-catalog" ? catalog : lastmod;
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
  plugins: [react(), mode === "development" && componentTagger(), catalogSnapshotPlugin(), seoPrerenderPlugin()].filter(Boolean),
}));
