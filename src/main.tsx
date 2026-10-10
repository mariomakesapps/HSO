import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App, { preloadRoute } from "./App.tsx";
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
const mount = () => {
  if (container.firstElementChild && container.dataset.ssrPath === here) hydrateRoot(container, app);
  else createRoot(container).render(app);
};

preloadRoute(window.location.pathname).then(mount, mount);
