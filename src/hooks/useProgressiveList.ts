import { startTransition, useEffect, useState } from "react";
import { useNavigationType } from "react-router-dom";

let appHasNavigated = false;

/** Called by ScrollToTop after any navigation past the first page load. */
export function markAppNavigated() {
  appHasNavigated = true;
}

/**
 * Renders a long list of cards in steps: the first screenful straight away, the
 * rest in small batches right after.
 *
 * Hub pages list up to ~500 programs. Building all of those cards in one go
 * blocked phones for about a second before anything showed. Every item still
 * ends up in the page within a few frames (so nothing is hidden from search
 * engines or in-page search), the page just paints and responds first.
 *
 * On browser back/forward the full list renders at once, because ScrollToTop
 * restores the saved scroll position immediately and needs the page at full
 * height to do it.
 */
export function useProgressiveList<T>(list: T[], first = 24, step = 48): T[] {
  const navigationType = useNavigationType();
  const instant = navigationType === "POP" && appHasNavigated;
  const [count, setCount] = useState(() => (instant ? list.length : Math.min(list.length, first)));
  const [source, setSource] = useState(list);

  // A new list (sort change, different hub) starts again from the first batch.
  if (source !== list) {
    setSource(list);
    setCount(instant ? list.length : Math.min(list.length, first));
  }

  useEffect(() => {
    if (count >= list.length) return;
    const id = window.setTimeout(() => {
      startTransition(() => setCount((c) => Math.min(list.length, c + step)));
    }, 0);
    return () => window.clearTimeout(id);
  }, [count, list.length, step]);

  return count >= list.length ? list : list.slice(0, count);
}
