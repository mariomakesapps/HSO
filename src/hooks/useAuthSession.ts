import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { store } from "@/store/collections";

const AUTH_EVENT = "hso-auth-change";

let cachedSession: Session | null = null;
let initialized = false;

async function ensureUserProfile(session: Session | null) {
  const user = session?.user;
  if (!user) return;
  const emailPrefix = user.email?.split("@")[0] || "hso_user";
  const usernameBase = emailPrefix.toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_+|_+$/g, "") || "hso_user";

  await (supabase as any)
    .from("users")
    .upsert(
      {
        id: user.id,
        username: `${usernameBase.slice(0, 28)}_${user.id.slice(0, 6)}`,
        avatar_url: user.user_metadata?.avatar_url ?? null,
      },
      { onConflict: "id", ignoreDuplicates: true },
    );
}

/**
 * Fire-and-forget welcome email for a newly created account.
 * Sends at most once per user via a localStorage marker keyed by user id,
 * so logins or session refreshes never re-trigger it.
 * Exported for tests.
 */
export async function sendWelcomeEmailIfNew(session: Session | null) {
  const user = session?.user;
  if (!user?.email) return;

  // Only consider this a "new account" if the user was created very recently.
  // This guards against firing on first sign-in after older accounts auth state restores.
  const createdAt = user.created_at ? new Date(user.created_at).getTime() : 0;
  const ageMs = Date.now() - createdAt;
  if (!createdAt || ageMs > 1000 * 60 * 60 * 24) return; // older than 24h -> skip

  const markerKey = `hso-welcome-sent:${user.id}`;
  try {
    if (localStorage.getItem(markerKey)) return;
    // Mark immediately to avoid races from multiple tabs / auth events.
    localStorage.setItem(markerKey, "1");
  } catch {
    // localStorage unavailable — proceed without dedupe rather than block.
  }

  const metadata = (user.user_metadata ?? {}) as Record<string, any>;
  const rawName: string | undefined =
    metadata.first_name || metadata.given_name || metadata.name || metadata.full_name;
  const firstName = rawName ? String(rawName).trim().split(/\s+/)[0] : undefined;

  try {
    const { error } = await supabase.functions.invoke("send-transactional-email", {
      body: {
        templateName: "welcome",
        recipientEmail: user.email,
        idempotencyKey: `welcome-${user.id}`,
        templateData: firstName ? { firstName } : {},
      },
    });
    if (error) {
      if (import.meta.env.DEV) console.error("[welcome email] send failed", error);
      try { localStorage.removeItem(markerKey); } catch { /* noop */ }
    }
  } catch (err) {
    if (import.meta.env.DEV) console.error("[welcome email] send threw", err);
    try { localStorage.removeItem(markerKey); } catch { /* noop */ }
  }
}

function publishSession(session: Session | null) {
  cachedSession = session;
  store.setUser(session?.user.id ?? null);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

async function initializeAuth() {
  if (initialized) return;
  initialized = true;

  const { data } = await supabase.auth.getSession();
  cachedSession = data.session;
  store.setUser(data.session?.user.id ?? null);
  await ensureUserProfile(data.session);
  window.dispatchEvent(new Event(AUTH_EVENT));

  supabase.auth.onAuthStateChange((_event, session) => {
    cachedSession = session;
    store.setUser(session?.user.id ?? null);
    setTimeout(() => {
      void ensureUserProfile(session);
      if (_event === "SIGNED_IN") {
        void sendWelcomeEmailIfNew(session);
      }
      window.dispatchEvent(new Event(AUTH_EVENT));
    }, 0);
  });
}

export function useAuthSession() {
  const [session, setSession] = useState<Session | null>(cachedSession);
  const [loading, setLoading] = useState(!initialized);

  useEffect(() => {
    let active = true;
    void initializeAuth().finally(() => {
      if (active) {
        setSession(cachedSession);
        setLoading(false);
      }
    });

    const sync = () => {
      setSession(cachedSession);
      setLoading(false);
    };
    window.addEventListener(AUTH_EVENT, sync);
    return () => {
      active = false;
      window.removeEventListener(AUTH_EVENT, sync);
    };
  }, []);

  return {
    session,
    user: session?.user ?? null,
    isAuthed: !!session,
    loading,
  };
}

export async function localSignUp(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  const username = normalized.split("@")[0]?.replace(/[^a-z0-9_]+/gi, "_").toLowerCase() || "hso_user";
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: normalized,
    password,
    options: { data: { username } },
  });
  if (signUpError) throw signUpError;

  if (signUpData.session) {
    publishSession(signUpData.session);
    await ensureUserProfile(signUpData.session);
    return;
  }

  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: normalized,
    password,
  });

  if (signInError) {
    if (/confirm|verification|verified/i.test(signInError.message)) {
      throw new Error(
        "Account created, but Supabase email confirmation is enabled. Turn off email confirmation in Supabase Auth settings if you want students logged in immediately after signup.",
      );
    }
    throw signInError;
  }

  if (!signInData.session) {
    throw new Error("Account created, but Supabase did not return an active session.");
  }

  publishSession(signInData.session);
  await ensureUserProfile(signInData.session);
}

export async function localSignIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) throw error;
  publishSession(data.session);
}

export async function localSignOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  publishSession(null);
}

/** Build an /auth URL that returns the user to the current page after sign-in. */
export function authRedirectHref(returnTo?: string) {
  const candidate = returnTo ?? (typeof window !== "undefined" ? window.location.pathname + window.location.search : "/");
  const path = candidate.startsWith("/") && !candidate.startsWith("/auth") ? candidate : "/";
  if (typeof window !== "undefined") {
    sessionStorage.setItem("hso-auth-return-to", path);
    try {
      sessionStorage.setItem(
        "hso-auth-return-scroll",
        JSON.stringify({ path, y: window.scrollY }),
      );
    } catch {
      /* ignore storage errors */
    }
  }
  return `/auth?redirect=${encodeURIComponent(path)}`;
}
