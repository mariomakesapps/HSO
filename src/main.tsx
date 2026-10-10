import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App, { preloadRoute } from "./App.tsx";
import "./index.css";

const container = document.getElementById("root")!;

// The build writes the fully rendered page into #root (scripts/prerender.mjs).
// Load the current route's page module first, so React's first render is the
// same page rather than an empty Suspense fallback. The prerendered HTML stays
// on screen until then, and the swap to the live app happens in one commit.
const mount = () =>
  createRoot(container).render(
    <HelmetProvider>
      <App />
    </HelmetProvider>,
  );

preloadRoute(window.location.pathname).then(mount, mount);
