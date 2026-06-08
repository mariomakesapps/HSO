import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Scroll behavior:
 * - Only scroll to top when the pathname truly changes (real route change).
 * - Ignore search-param and hash changes (filters, tabs, modals, etc.).
 * - On POP (browser back/forward): restore the previous scroll position
 *   for that history entry so users return to exactly where they were.
 */
const ScrollToTop = () => {
  const { key, pathname } = useLocation();
  const navType = useNavigationType();
  const positions = useRef<Map<string, number>>(new Map());
  const prevKey = useRef<string>(key);
  const prevPathname = useRef<string>(pathname);

  // Disable the browser's own scroll restoration; we manage it.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      const previous = window.history.scrollRestoration;
      window.history.scrollRestoration = "manual";
      return () => {
        window.history.scrollRestoration = previous;
      };
    }
  }, []);

  // Save scroll for the outgoing entry before the new one paints.
  useLayoutEffect(() => {
    if (prevKey.current !== key) {
      positions.current.set(prevKey.current, window.scrollY);
      prevKey.current = key;
    }
  }, [key]);

  useLayoutEffect(() => {
    if (navType === "POP") {
      const y = positions.current.get(key) ?? 0;
      window.scrollTo({ top: y, left: 0, behavior: "auto" });
      prevPathname.current = pathname;
    } else if (prevPathname.current !== pathname) {
      // If we just returned from /auth, restore the scroll position the
      // user had before they were sent to sign in.
      let restored = false;
      try {
        const raw = sessionStorage.getItem("hso-auth-return-scroll");
        if (raw) {
          const saved = JSON.parse(raw) as { path?: string; y?: number };
          const here = pathname + window.location.search;
          if (
            saved?.path &&
            typeof saved.y === "number" &&
            (saved.path === here || saved.path === pathname || here.startsWith(saved.path))
          ) {
            window.scrollTo({ top: saved.y, left: 0, behavior: "auto" });
            restored = true;
          }
          sessionStorage.removeItem("hso-auth-return-scroll");
        }
      } catch {
        /* ignore */
      }
      if (!restored) {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
      prevPathname.current = pathname;
    }
    // Same-pathname changes (search/hash) preserve current scroll position.
  }, [key, pathname, navType]);

  return null;
};

export default ScrollToTop;
