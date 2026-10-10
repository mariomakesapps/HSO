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

        const pages = await prerender({ root, distDir });
        const sitemap = await generateSitemap({ root, distDir });

        this.info(
          `prerendered ${pages.written} pages (${pages.indexable} indexable, ${pages.noindexed} noindex) · sitemap ${sitemap.indexable} URLs (${sitemap.excluded} excluded) · 404.html + ${pages.redirects} permanent redirects · ${pages.ssrFailures} SSR fallbacks`,
        );
      } catch (err) {
        // A prerender failure must not silently ship an SPA-only build.
        this.error(`SEO prerender failed: ${(err as Error).stack ?? err}`);
      }
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
  plugins: [react(), mode === "development" && componentTagger(), seoPrerenderPlugin()].filter(Boolean),
}));
