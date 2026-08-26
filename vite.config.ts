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
          `prerendered ${pages.written} pages (${pages.indexable} indexable, ${pages.noindexed} noindex) · sitemap ${sitemap.indexable} URLs (${sitemap.excluded} excluded)`,
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
  plugins: [react(), mode === "development" && componentTagger(), seoPrerenderPlugin()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
}));
