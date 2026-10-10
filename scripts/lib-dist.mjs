/** Shared helpers for the scripts that read the built HTML in dist/. */
import fs from "node:fs";
import path from "node:path";

export function builtPages(distDir) {
  const out = [];
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === "index.html") {
        const rel = path.relative(distDir, path.dirname(p)).split(path.sep).join("/");
        out.push({ route: rel ? `/${rel}` : "/", file: p });
      }
    }
  };
  walk(distDir);
  return out;
}

const ENTITIES = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&#x27;": "'", "&nbsp;": " " };
export const decode = (s) => s.replace(/&(amp|lt|gt|quot|#39|#x27|nbsp);/g, (m) => ENTITIES[m] ?? m);

export function readHead(html) {
  return {
    title: decode(html.match(/<title[^>]*>([^<]*)<\/title>/)?.[1] ?? ""),
    description: decode(html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/)?.[1] ?? ""),
    robots: html.match(/<meta[^>]*name="robots"[^>]*content="([^"]*)"/)?.[1] ?? "",
    canonical: html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/)?.[1] ?? "",
  };
}

export function bodyOf(html) {
  return html.slice(html.indexOf("<body"));
}

/** Visible text of the body, tags stripped, whitespace collapsed. */
export function bodyText(html) {
  return decode(
    bodyOf(html)
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}
