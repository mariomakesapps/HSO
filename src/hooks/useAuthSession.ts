import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

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
  return `/auth?redirect=${encodeURIComponent(path)}`;
}