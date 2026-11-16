import { useSyncExternalStore } from "react";
import { getSupabase } from "@/integrations/supabase/lazy";

type State = {
  favorites: string[];
  savedCurated: string[];
  likedCurated: string[];
  curatedCounts: Record<string, { likes: number; saves: number }>;
  loading: boolean;
  error: string | null;
};

// The Supabase client loads on first use (see lazy.ts); tables here are untyped.
const getDb = async () => (await getSupabase()) as any;
const listeners = new Set<() => void>();
let userId: string | null = null;

let state: State = {
  favorites: [],
  savedCurated: [],
  likedCurated: [],
  curatedCounts: {},
  loading: false,
  error: null,
};

function emit() {
  listeners.forEach((l) => l());
}
function setState(next: Partial<State>) {
  state = { ...state, ...next };
  emit();
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function getSnapshot() {
  return state;
}

export function useStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
export function useFavorites() {
  return useSyncExternalStore(subscribe, () => state.favorites, () => state.favorites);
}
export function useFavoriteStatus(id: string) {
  return useSyncExternalStore(
    subscribe,
    () => state.favorites.includes(id),
    () => state.favorites.includes(id),
  );
}
export function useShelfCount() {
  return useSyncExternalStore(
    subscribe,
    () => state.favorites.length + state.savedCurated.length,
    () => state.favorites.length + state.savedCurated.length,
  );
}
export function useCuratedSavedStatus(curatedId: string) {
  return useSyncExternalStore(
    subscribe,
    () => state.savedCurated.includes(curatedId),
    () => state.savedCurated.includes(curatedId),
  );
}
export function useCuratedLikedStatus(curatedId: string) {
  return useSyncExternalStore(
    subscribe,
    () => state.likedCurated.includes(curatedId),
    () => state.likedCurated.includes(curatedId),
  );
}

export function useCuratedCounts() {
  return useSyncExternalStore(subscribe, () => state.curatedCounts, () => state.curatedCounts);
}

export async function loadCuratedCounts() {
  try {
    const db = await getDb();
    const { data, error } = await db.rpc("get_curated_collection_counts");
    if (error || !Array.isArray(data)) return;
    const next: Record<string, { likes: number; saves: number }> = {};
    for (const row of data as any[]) {
      if (!row?.curated_id) continue;
      next[row.curated_id] = {
        likes: Number(row.like_count ?? 0),
        saves: Number(row.save_count ?? 0),
      };
    }
    setState({ curatedCounts: next });
  } catch {
    // silent — counts are non-critical
  }
}

async function loadCloudState() {
  if (!userId) {
    setState({ favorites: [], savedCurated: [], likedCurated: [], loading: false, error: null });
    return;
  }
  setState({ loading: true, error: null });
  const db = await getDb();
  const [savesRes, curatedSavesRes, curatedLikesRes] = await Promise.all([
    db.from("saved_opportunities").select("opportunity_id").eq("user_id", userId),
    db.from("curated_collection_saves").select("curated_id").eq("user_id", userId),
    db.from("curated_collection_likes").select("curated_id").eq("user_id", userId),
  ]);
  setState({
    favorites: (savesRes.data ?? []).map((r: any) => r.opportunity_id).filter(Boolean),
    savedCurated: (curatedSavesRes.data ?? []).map((r: any) => r.curated_id).filter(Boolean),
    likedCurated: (curatedLikesRes.data ?? []).map((r: any) => r.curated_id).filter(Boolean),
    loading: false,
    error: savesRes.error?.message ?? curatedSavesRes.error?.message ?? curatedLikesRes.error?.message ?? null,
  });
}

async function requireUser() {
  const supabase = await getSupabase();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user?.id) throw new Error("Sign in to save opportunities.");
  userId = data.user.id;
  return data.user.id;
}

export const store = {
  setUser(uid: string | null) {
    if (uid === userId) return;
    userId = uid;
    if (!uid) {
      setState({ favorites: [], savedCurated: [], likedCurated: [], loading: false, error: null });
      return;
    }
    void loadCloudState();
  },

  async reload() {
    await loadCloudState();
  },

  isFavorite(id: string) {
    return state.favorites.includes(id);
  },

  async toggleFavorite(id: string) {
    const uid = await requireUser();
    const db = await getDb();
    const exists = state.favorites.includes(id);
    const previous = state.favorites;
    const next = exists ? previous.filter((x) => x !== id) : [...previous, id];
    setState({ favorites: next });
    const result = exists
      ? await db.from("saved_opportunities").delete().eq("user_id", uid).eq("opportunity_id", id)
      : await db.from("saved_opportunities").upsert({ user_id: uid, opportunity_id: id }, { onConflict: "user_id,opportunity_id" });
    if (result.error) {
      setState({ favorites: previous });
      throw result.error;
    }
  },

  async removeFavorite(id: string) {
    if (!state.favorites.includes(id)) return;
    await this.toggleFavorite(id);
  },

  async toggleCuratedSave(curatedId: string) {
    const uid = await requireUser();
    const db = await getDb();
    const exists = state.savedCurated.includes(curatedId);
    const previous = state.savedCurated;
    const next = exists ? previous.filter((x) => x !== curatedId) : [...previous, curatedId];
    const prevCounts = state.curatedCounts;
    const prevCount = prevCounts[curatedId] ?? { likes: 0, saves: 0 };
    const nextCount = { ...prevCount, saves: Math.max(0, prevCount.saves + (exists ? -1 : 1)) };
    setState({ savedCurated: next, curatedCounts: { ...prevCounts, [curatedId]: nextCount } });
    const result = exists
      ? await db.from("curated_collection_saves").delete().eq("user_id", uid).eq("curated_id", curatedId)
      : await db.from("curated_collection_saves").upsert({ user_id: uid, curated_id: curatedId }, { onConflict: "user_id,curated_id" });
    if (result.error) {
      setState({ savedCurated: previous, curatedCounts: prevCounts });
      throw result.error;
    }
  },

  async toggleCuratedLike(curatedId: string) {
    const uid = await requireUser();
    const db = await getDb();
    const exists = state.likedCurated.includes(curatedId);
    const previous = state.likedCurated;
    const next = exists ? previous.filter((x) => x !== curatedId) : [...previous, curatedId];
    const prevCounts = state.curatedCounts;
    const prevCount = prevCounts[curatedId] ?? { likes: 0, saves: 0 };
    const nextCount = { ...prevCount, likes: Math.max(0, prevCount.likes + (exists ? -1 : 1)) };
    setState({ likedCurated: next, curatedCounts: { ...prevCounts, [curatedId]: nextCount } });
    const result = exists
      ? await db.from("curated_collection_likes").delete().eq("user_id", uid).eq("curated_id", curatedId)
      : await db.from("curated_collection_likes").upsert({ user_id: uid, curated_id: curatedId }, { onConflict: "user_id,curated_id" });
    if (result.error) {
      setState({ likedCurated: previous, curatedCounts: prevCounts });
      throw result.error;
    }
  },
};