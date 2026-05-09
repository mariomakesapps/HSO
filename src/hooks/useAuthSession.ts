import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const AUTH_RETURN_KEY = "authReturnTo";

export function sanitizeAuthReturnTo(value?: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value, window.location.origin);
    if (url.origin !== window.location.origin || url.pathname === "/auth") return null;
    return `${url.pathname}${url.search}${url.hash}` || "/";
  } catch {
    return value.startsWith("/") && !value.startsWith("//") && value !== "/auth" ? value : null;
  }
}

export function consumeAuthReturnTo(fallback = "/") {
  const stored = sanitizeAuthReturnTo(sessionStorage.getItem(AUTH_RETURN_KEY));
  sessionStorage.removeItem(AUTH_RETURN_KEY);
  return stored ?? fallback;
}

export function useAuthSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      setSession(sess);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, user: session?.user ?? null, isAuthed: !!session, loading };
}

/** Build an /auth URL that returns the user to the current page after sign-in. */
export function authRedirectHref(returnTo?: string) {
  const path = returnTo ?? (typeof window !== "undefined" ? window.location.pathname + window.location.search : "/");
  const safePath = sanitizeAuthReturnTo(path) ?? "/";
  if (typeof window !== "undefined") sessionStorage.setItem(AUTH_RETURN_KEY, safePath);
  return `/auth?redirect=${encodeURIComponent(safePath)}`;
}

export function rememberAuthReturnTo(returnTo?: string) {
  const safePath = sanitizeAuthReturnTo(returnTo ?? (window.location.pathname + window.location.search)) ?? "/";
  sessionStorage.setItem(AUTH_RETURN_KEY, safePath);
  return safePath;
}