import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App, { preloadRoute } from "./App.tsx";
import { freezeClock } from "./lib/clock";
import "./index.css";

const container = document.getElementById("root")!;

// The build writes the fully rendered page into #root (scripts/prerender.mjs).
// Load the current route's page module first, then hydrate: React adopts the
// server-rendered DOM instead of replacing it, so the first paint is the final
// paint (no second LCP once the data chunk arrives). A page with no prerendered
// markup, or markup rendered for another URL (the 404 page, a trailing-slash
// variant), is rendered from scratch.
const app = (
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
const here = window.location.pathname.replace(/\/+$/, "") || "/";
// The prerendered home page is the unfiltered list. A shared link like
// /?state=Maryland shows a different list, so hydrating would mismatch on every
// card and React would throw the markup away anyway, after logging errors.
const FILTER_PARAMS = ["q", "category", "grade", "cost", "format", "field", "state", "status", "free", "month", "sort", "page"];
const query = new URLSearchParams(window.location.search);
const filtered = FILTER_PARAMS.some((key) => query.has(key));
const mount = () => {
  if (container.firstElementChild && container.dataset.ssrPath === here && !filtered) {
    // Render the first pass against the build time the markup was made at, so the
    // deadline labels match it exactly. App releases the clock once hydrated.
    const ssrNow = Number(container.dataset.ssrNow);
    if (Number.isFinite(ssrNow) && ssrNow > 0) freezeClock(ssrNow);
    hydrateRoot(container, app);
  }
  else createRoot(container).render(app);
};

preloadRoute(window.location.pathname).then(mount, mount);
