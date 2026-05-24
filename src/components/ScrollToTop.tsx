import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * On PUSH/REPLACE navigations: scroll to top.
 * On POP (browser back/forward): restore the previous scroll position
 * for that history entry so users return to exactly where they were.
 */
const ScrollToTop = () => {
  const { key, pathname } = useLocation();
  const navType = useNavigationType();
  const positions = useRef<Map<string, number>>(new Map());
  const prevKey = useRef<string>(key);

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
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    }
    // pathname intentionally included so same-key replacements still reset
  }, [key, pathname, navType]);

  return null;
};

export default ScrollToTop;
