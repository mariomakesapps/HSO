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
  return {
    name: "hso-seo-prerender",
    apply: "build",
    enforce: "post",
    async closeBundle() {
      const distDir = path.resolve(root, "dist");
      try {
        const { prerender } = await import("./scripts/prerender.mjs");
        const { generateSitemap } = await import("./scripts/generate-sitemap.mjs");

        const pages = await prerender({ root, distDir });
        const sitemap = await generateSitemap({ root, distDir });

        this.info(
          `prerendered ${pages.written} pages (${pages.indexable} indexable, ${pages.noindexed} noindex) · sitemap index: ${sitemap.indexable} URLs, ${sitemap.withLastmod} with lastmod (${sitemap.excluded} excluded) · 404.html + ${pages.redirects} permanent redirects`,
        );
      } catch (err) {
        // A prerender failure must not silently ship an SPA-only build.
        this.error(`SEO prerender failed: ${(err as Error).stack ?? err}`);
      }
    },
  };
}

/**
 * Ships the finished opportunity catalogue to browsers as precompiled JSON.
 *
 * src/data/opportunities.ts builds the catalogue from the base list plus every
 * dated update, addition, link check and hygiene rule. That is about 4.5 MB of
 * JavaScript, and every visitor used to download it and rebuild the same records
 * on page load. In production client builds this plugin runs the pipeline once
 * (scripts/build-catalogue.mjs) and replaces that module with the result plus the
 * small helpers in opportunityModel.ts. src/data/listingDates.ts, which imports
 * every dated update file just to read their keys, is replaced the same way by
 * its finished id -> date table plus listingDatesModel.ts. The records are
 * identical to what the pipeline produces, which is also what the prerendered
 * pages and sitemaps use.
 *
 * Dev (Lovable preview) and tests still run the pipeline live, so edits to data
 * files show up immediately there.
 */
function precompiledCataloguePlugin(): Plugin {
  const root = __dirname;
  const data = (name: string) => path.resolve(root, "src/data", name);
  // Module (as imported, without extension) -> virtual replacement id.
  const REPLACED: Record<string, string> = {
    [data("opportunities")]: "\0hso-precompiled-catalogue",
    "@/data/opportunities": "\0hso-precompiled-catalogue",
    [data("listingDates")]: "\0hso-precompiled-listing-dates",
    "@/data/listingDates": "\0hso-precompiled-listing-dates",
  };
  let built: { opportunities: string; lastChanged: string } | null = null;
  let ssr = false;
  return {
    name: "hso-precompiled-catalogue",
    apply: "build",
    enforce: "pre",
    configResolved(config) {
      ssr = Boolean(config.build.ssr);
    },
    async buildStart() {
      if (ssr) return;
      const { buildCatalogueJson } = await import("./scripts/build-catalogue.mjs");
      built = await buildCatalogueJson({ root });
    },
    resolveId(id) {
      if (ssr) return null;
      return REPLACED[id.replace(/\.ts$/, "")] ?? null;
    },
    load(id) {
      if (!built) return null;
      // JSON.parse of a string literal is much faster for engines to load than
      // the same data written as a JavaScript object literal.
      if (id === "\0hso-precompiled-catalogue") {
        return [
          `export * from ${JSON.stringify(data("opportunityModel.ts"))};`,
          `export const allOpportunities = JSON.parse(${JSON.stringify(built.opportunities)});`,
        ].join("\n");
      }
      if (id === "\0hso-precompiled-listing-dates") {
        return [
          `import { makeListingDates } from ${JSON.stringify(data("listingDatesModel.ts"))};`,
          `export const LAST_CHANGED = JSON.parse(${JSON.stringify(built.lastChanged)});`,
          `export const { listingLastModified, latestLastModified } = makeListingDates(LAST_CHANGED);`,
        ].join("\n");
      }
      return null;
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
  plugins: [
    precompiledCataloguePlugin(),
    react(),
    mode === "development" && componentTagger(),
    seoPrerenderPlugin(),
  ].filter(Boolean),
}));
