## Why links are getting blocked

Two causes:

1. **Most "Visit program" links are Google search URLs.** The 10,000+ synthetic opportunities all use `https://www.google.com/search?q=...` (see `src/data/opportunities.ts:187`) and the card falls back to a Google search whenever `url` is `#` or missing (see `src/components/OpportunityCard.tsx:32-35`). When opened from inside the Lovable preview iframe, the browser/Google often blocks this navigation and shows "This page is blocked." Even outside the preview, sending users to a Google results page is poor UX.
2. **`target="_blank"` from a sandboxed iframe** is sometimes blocked by the browser as a popup. We need to use a safer click handler.

## The fix

### 1. Replace the Google-search fallback with DuckDuckGo's redirect

DuckDuckGo's `https://duckduckgo.com/?q=...` (with `&kl=us-en`) is not blocked in iframes/popups and works reliably. For the 10k synthetic items in `src/data/opportunities.ts` (line ~187), switch:

```text
https://www.google.com/search?q=...   →   https://duckduckgo.com/?q=...
```

Apply the same change to the fallback in `OpportunityCard.tsx` (lines 32–35).

### 2. Make link clicks resilient in the preview iframe

In `src/components/OpportunityCard.tsx`, change the "Visit program" anchor to use an `onClick` handler that:

- Calls `window.open(url, '_blank', 'noopener,noreferrer')`.
- If the returned window is `null` (popup blocked), falls back to `window.top.location.href = url` so it opens in the parent tab instead of being silently blocked.
- Keep the `<a href>` so right-click / copy-link still works.

### 3. (Small polish) Show the destination on hover

Add `title={linkUrl}` on the link so users can see where it goes before clicking. No behavior change.

## Files to edit

- `src/components/OpportunityCard.tsx` — new click handler, DuckDuckGo fallback, `title` attribute.
- `src/data/opportunities.ts` — change the synthetic generator's `url:` (line ~187) from Google to DuckDuckGo.

## Out of scope

- Curating real URLs for all 10,000 synthetic items (not feasible). DuckDuckGo search is the pragmatic fallback.
- The 18 hand-picked entries (RSI, TASP, etc.) already have real URLs and will continue to work.
