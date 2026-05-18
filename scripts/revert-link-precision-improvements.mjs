import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const REPORT = path.join(ROOT, "reports/link-precision-report.json");
const DATA_FILES = [
  "src/data/opportunities.ts",
  "src/data/stateOpportunities.ts",
  "src/data/additionalUsOpportunities.ts",
  "src/data/generatedBulkOpportunities.ts",
];

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeReplacement(value) {
  return String(value).replace(/\$/g, "$$$$");
}

const report = JSON.parse(await readFile(REPORT, "utf8"));
const changes = report.improved || [];
const reverted = [];

for (const relativeFile of DATA_FILES) {
  const file = path.join(ROOT, relativeFile);
  let content = await readFile(file, "utf8");
  const lines = content.split(/\r?\n/);
  let changed = false;

  for (const change of changes) {
    if (reverted.some((item) => item.id === change.id)) continue;
    const idPattern = new RegExp(`["']id["']?\\s*:\\s*["']${escapeRegExp(change.id)}["']|\\bid\\s*:\\s*["']${escapeRegExp(change.id)}["']`);
    const idLine = lines.findIndex((line) => idPattern.test(line));
    if (idLine === -1) continue;

    for (let i = idLine; i < Math.min(lines.length, idLine + 90); i += 1) {
      if (!/(?:\burl\s*:|"url"\s*:)\s*"/.test(lines[i])) continue;
      if (!lines[i].includes(change.new_url)) break;
      const nextLine = lines[i]
        .replace(/(\burl\s*:\s*")([^"]*)(")/, `$1${escapeReplacement(change.old_url)}$3`)
        .replace(/("url"\s*:\s*")([^"]*)(")/, `$1${escapeReplacement(change.old_url)}$3`);
      if (nextLine !== lines[i]) {
        lines[i] = nextLine;
        changed = true;
        reverted.push({ id: change.id, file: relativeFile, new_url: change.new_url, restored_url: change.old_url });
      }
      break;
    }
  }

  if (changed) {
    content = lines.join("\n");
    await writeFile(file, content, "utf8");
  }
}

console.log(`Reverted ${reverted.length} link precision URL changes.`);
