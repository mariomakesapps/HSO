// Deterministic baseline like count per curated collection, so newly-launched
// collections never display "0 likes". The baseline is a stable pseudo-random
// number derived from the collection id, then real likes from the database
// are added on top — so every interaction still moves the displayed count up.

function hashString(input: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Range tuned to feel "active site" without looking fake: ~340–1480 likes.
export function baselineLikes(curatedId: string): number {
  if (!curatedId) return 0;
  const h = hashString(curatedId);
  return 340 + (h % 1141);
}

export function displayedLikes(curatedId: string, actual: number | undefined): number {
  return baselineLikes(curatedId) + (actual ?? 0);
}