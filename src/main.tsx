import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// After a new deploy, an open tab can reference chunk files that no longer
// exist. Detect that failure and reload once to fetch the fresh bundle.
const isStaleChunkError = (value: unknown): boolean => {
  const message =
    typeof value === "string"
      ? value
      : value instanceof Error
        ? value.message
        : "";
  return (
    message.includes("Failed to fetch dynamically imported module") ||
    message.includes("Importing a module script failed") ||
    message.includes("error loading dynamically imported module")
  );
};

const reloadForFreshBundle = () => {
  if (sessionStorage.getItem("hso-chunk-reload") === "1") return;
  sessionStorage.setItem("hso-chunk-reload", "1");
  window.location.reload();
};

window.addEventListener("unhandledrejection", (event) => {
  if (isStaleChunkError(event.reason)) {
    event.preventDefault();
    reloadForFreshBundle();
  }
});

window.addEventListener("error", (event) => {
  if (isStaleChunkError(event.message)) reloadForFreshBundle();
});

// Vite fires this when a preloaded chunk fails; reload instead of crashing.
window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault();
  reloadForFreshBundle();
});

// Clear the guard only once the app has run stably, so a broken deploy cannot loop.
window.setTimeout(() => sessionStorage.removeItem("hso-chunk-reload"), 10000);

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>,
);
