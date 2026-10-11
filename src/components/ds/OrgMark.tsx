import { cn } from "@/lib/utils";

/** Muted brand tints only: the palette allows no other accent colors. */
const TINTS = [
  "bg-hso-neutral-tint text-hso-muted",
  "bg-hso-coral-tint text-hso-coral-strong",
  "bg-hso-green-tint text-hso-green-strong",
];

const STOP = new Set(["the", "of", "and", "for", "at", "a", "an", "in", "on", "&", "/", "-"]);

function initials(org: string): string {
  const words = org
    .replace(/\(.*?\)/g, " ")
    .split(/[\s/,–—-]+/)
    .filter((w) => w && !STOP.has(w.toLowerCase()) && /[A-Za-z0-9]/.test(w));
  if (!words.length) return "?";
  if (words.length === 1) return words[0].replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * The organization's mark. The catalogue stores no logos, so every listing gets
 * a square with the organization's initials, tinted the same way every time.
 */
export function OrgMark({ org, size = 48, className }: { org: string; size?: 40 | 48 | 64; className?: string }) {
  const dims = size === 64 ? "h-16 w-16 text-xl" : size === 40 ? "h-10 w-10 text-sm" : "h-12 w-12 text-base";
  return (
    <span
      aria-hidden="true"
      className={cn("inline-flex shrink-0 select-none items-center justify-center rounded-hso font-bold", dims, TINTS[hash(org) % TINTS.length], className)}
    >
      {initials(org)}
    </span>
  );
}
