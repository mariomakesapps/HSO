declare module "*.mjs" {
  export const buildCatalogueJson: (opts: { root: string }) => Promise<{ opportunities: string; lastChanged: string }>;
  export const prerender: (opts: { root: string; distDir: string }) => Promise<{ written: number; indexable: number; noindexed: number; redirects: number }>;
  export const generateSitemap: (opts: { root: string; distDir: string }) => Promise<{ indexable: number; excluded: number; withLastmod: number }>;
}
