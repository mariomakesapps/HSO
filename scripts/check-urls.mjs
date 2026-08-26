/**
 * Checks URLs with a real browser User-Agent, following redirects.
 *
 * Uses curl rather than Node's fetch as the transport. Node's fetch failed on
 * several hosts here (imsa.edu among them) that curl retrieves with a clean
 * 200 — a TLS/HTTP2 negotiation quirk, not a dead site. Trusting fetch would
 * mean deleting working links from the catalog on false evidence.
 *
 *   node scripts/check-urls.mjs <url> [url...]
 *   node scripts/check-urls.mjs --file urls.txt
 */
import fs from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

const args = process.argv.slice(2);
const urls =
  args[0] === "--file"
    ? fs.readFileSync(args[1], "utf8").split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"))
    : args;

export async function checkUrl(url) {
  try {
    const { stdout } = await run(
      "curl",
      [
        "-sL",
        "--max-time", "25",
        "--compressed",
        "-A", UA,
        "-H", "accept: text/html,application/xhtml+xml,*/*;q=0.8",
        "-H", "accept-language: en-US,en;q=0.9",
        "-w", "\\n---HSOMETA---%{http_code} %{url_effective}",
        url,
      ],
      { maxBuffer: 12 * 1024 * 1024 },
    );

    const i = stdout.lastIndexOf("---HSOMETA---");
    const meta = stdout.slice(i + 13).trim().split(" ");
    const status = Number(meta[0]);
    const finalUrl = meta.slice(1).join(" ");
    const body = stdout.slice(0, i);

    // A 200 that renders "page not found" is still a dead link.
    const soft =
      status === 200 &&
      /<title[^>]*>[^<]*(404|page not found|not found)[^<]*<\/title>|this page (?:doesn'?t|does not) exist|no longer available/i.test(
        body.slice(0, 6000),
      );

    return { url, status, finalUrl, soft, ok: status >= 200 && status < 400 && !soft };
  } catch (e) {
    return { url, status: 0, ok: false, err: (e.stderr || e.message || "").trim().slice(0, 90) };
  }
}

if (urls.length) {
  const out = [];
  const queue = [...urls];
  await Promise.all(
    Array.from({ length: 8 }, async () => {
      while (queue.length) out.push(await checkUrl(queue.shift()));
    }),
  );
  // Keep input order for readability.
  out.sort((a, b) => urls.indexOf(a.url) - urls.indexOf(b.url));
  for (const r of out) {
    const redirect = r.finalUrl && r.finalUrl !== r.url ? `  -> ${r.finalUrl}` : "";
    console.log(
      `${r.ok ? "OK  " : "DEAD"} ${String(r.status).padEnd(4)} ${r.url}${redirect}${r.soft ? "  [soft-404]" : ""}${r.err ? "  " + r.err : ""}`,
    );
  }
  console.log(`\n${out.filter((r) => r.ok).length}/${out.length} reachable`);
}
