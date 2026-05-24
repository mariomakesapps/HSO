import { useEffect } from "react";

const SITE_URL = "https://highschoolopportunity.org";

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(href: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSEO({ title, description }: { title: string; description?: string }) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    const url = SITE_URL + (typeof window !== "undefined" ? window.location.pathname : "/");
    setCanonical(url);
    setMeta("og:url", url, "property");
    setMeta("og:title", title, "property");
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", title);
    if (description) {
      setMeta("description", description);
      setMeta("og:description", description, "property");
      setMeta("twitter:description", description);
    }
    return () => {
      document.title = prevTitle;
    };
  }, [title, description]);
}