declare module "*.mjs" {
  export const prerender: (opts: { root: string; distDir: string }) => Promise<{ written: number; indexable: number; noindexed: number; redirects: number }>;
  export const generateSitemap: (opts: { root: string; distDir: string }) => Promise<{ indexable: number; excluded: number; withLastmod: number }>;
}
