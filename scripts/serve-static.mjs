/**
 * Minimal static server that mirrors how Netlify, Cloudflare Pages, Vercel and
 * S3/CloudFront resolve a request: exact file first, then <path>/index.html,
 * and only then the SPA fallback.
 *
 * `vite preview` rewrites every unknown path to /index.html unconditionally,
 * which hides whether the prerendered per-route files actually resolve. Use
 * this to check the build the way a real host would serve it:
 *
 *   node scripts/serve-static.mjs [port]
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const distDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../dist");
const port = Number(process.argv[2] ?? 5000);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".txt": "text/plain; charset=utf-8",
};

const readIfFile = (p) => {
  try {
    return fs.statSync(p).isFile() ? p : null;
  } catch {
    return null;
  }
};

http
  .createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const rel = path.normalize(urlPath).replace(/^([/\\])+/, "");
    const target = path.join(distDir, rel);

    // Host resolution order: exact file → directory index → SPA fallback.
    const resolved =
      readIfFile(target) ??
      readIfFile(path.join(target, "index.html")) ??
      readIfFile(path.join(distDir, "index.html"));

    if (!resolved) {
      res.writeHead(404).end("not found");
      return;
    }

    const isFallback =
      resolved === path.join(distDir, "index.html") && rel !== "" && rel !== "index.html";

    res.writeHead(isFallback ? 200 : 200, {
      "content-type": TYPES[path.extname(resolved)] ?? "application/octet-stream",
      "x-resolved-by": isFallback ? "spa-fallback" : "static-file",
    });
    fs.createReadStream(resolved).pipe(res);
  })
  .listen(port, () => console.log(`static host emulation on http://localhost:${port}`));
