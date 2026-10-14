declare module "*.mjs" {
  export const prerender: (opts: { root: string; distDir: string }) => Promise<{ written: number; indexable: number; noindexed: number; redirects: number; ssrFailures: number }>;
  export const generateSitemap: (opts: { root: string; distDir: string }) => Promise<{ indexable: number; excluded: number; withLastmod: number }>;
  export const checkSitemap: (opts: { distDir: string }) => Promise<{ problems: string[] }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- an arbitrary bundled module
  export const importBundle: (result: { outputFiles: { text: string }[] }) => Promise<any>;
}
