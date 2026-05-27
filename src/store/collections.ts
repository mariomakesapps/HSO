import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";

type State = {
  favorites: string[];
  savedCurated: string[];
  likedCurated: string[];
  loading: boolean;
  error: string | null;
};

const db = supabase as any;
const listeners = new Set<() => void>();
let userId: string | null = null;

let state: State = {
  favorites: [],
  savedCurated: [],
  likedCurated: [],
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

async function loadCloudState() {
  if (!userId) {
    setState({ favorites: [], savedCurated: [], likedCurated: [], loading: false, error: null });
    return;
  }
  setState({ loading: true, error: null });
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
    const exists = state.savedCurated.includes(curatedId);
    const previous = state.savedCurated;
    const next = exists ? previous.filter((x) => x !== curatedId) : [...previous, curatedId];
    setState({ savedCurated: next });
    const result = exists
      ? await db.from("curated_collection_saves").delete().eq("user_id", uid).eq("curated_id", curatedId)
      : await db.from("curated_collection_saves").upsert({ user_id: uid, curated_id: curatedId }, { onConflict: "user_id,curated_id" });
    if (result.error) {
      setState({ savedCurated: previous });
      throw result.error;
    }
  },

  async toggleCuratedLike(curatedId: string) {
    const uid = await requireUser();
    const exists = state.likedCurated.includes(curatedId);
    const previous = state.likedCurated;
    const next = exists ? previous.filter((x) => x !== curatedId) : [...previous, curatedId];
    setState({ likedCurated: next });
    const result = exists
      ? await db.from("curated_collection_likes").delete().eq("user_id", uid).eq("curated_id", curatedId)
      : await db.from("curated_collection_likes").upsert({ user_id: uid, curated_id: curatedId }, { onConflict: "user_id,curated_id" });
    if (result.error) {
      setState({ likedCurated: previous });
      throw result.error;
    }
  },
};