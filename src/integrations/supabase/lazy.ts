import type { supabase as SupabaseClient } from "@/integrations/supabase/client";

/**
 * The Supabase client, loaded on first use.
 *
 * supabase-js (auth, realtime, storage, database) is about 190 KB of the main
 * bundle, and every page used to parse it before first render even though most
 * visitors never sign in. Startup code (the auth session check and the saved
 * shelf) gets the client from here instead, so it loads as its own chunk in
 * parallel with the page. Pages that use it directly (forms, the profile) can
 * keep importing "@/integrations/supabase/client"; both share one instance.
 */
let loading: Promise<typeof SupabaseClient> | null = null;

export function getSupabase(): Promise<typeof SupabaseClient> {
  loading ??= import("@/integrations/supabase/client").then((m) => m.supabase);
  return loading;
}
