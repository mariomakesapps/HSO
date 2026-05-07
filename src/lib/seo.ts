import { useEffect } from "react";

function setMeta(name: string, content: string, attr: "name" | "property" = "name") {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function useSEO({ title, description }: { title: string; description?: string }) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;
    if (description) {
      setMeta("description", description);
      setMeta("og:title", title, "property");
      setMeta("og:description", description, "property");
      setMeta("twitter:title", title);
      setMeta("twitter:description", description);
    }
    return () => {
      document.title = prevTitle;
    };
  }, [title, description]);
}