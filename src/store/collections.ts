import { useSyncExternalStore } from "react";
import { opportunities } from "@/data/opportunities";

export type Collection = {
  id: string;
  name: string;
  emoji: string;
  opportunityIds: string[];
  createdAt: number;
};

type State = {
  favorites: string[];
  collections: Collection[];
};

const LEGACY_KEY = "atlas-collections-v1";
const BASE = "hso-shelf-v2";
const listeners = new Set<() => void>();

let userKey = "anon";

function storageKey() {
  return `${BASE}:${userKey}`;
}

function emptyState(): State {
  return { favorites: [], collections: [] };
}

function sanitize(s: State): State {
  const validIds = new Set(opportunities.map((o) => o.id));
  return {
    favorites: (s.favorites ?? []).filter((id) => validIds.has(id)),
    collections: (s.collections ?? []).map((c) => ({
      ...c,
      opportunityIds: (c.opportunityIds ?? []).filter((id) => validIds.has(id)),
    })),
  };
}

function load(): State {
  if (typeof window === "undefined") return emptyState();
  try {
    const raw = localStorage.getItem(storageKey());
    if (raw) return sanitize(JSON.parse(raw));
  } catch {}
  // One-time migration from legacy key for the anonymous bucket only.
  if (userKey === "anon") {
    try {
      const legacy = localStorage.getItem(LEGACY_KEY);
      if (legacy) {
        const parsed = sanitize(JSON.parse(legacy));
        // Drop any seeded empty starter collection.
        parsed.collections = parsed.collections.filter(
          (c) => !(c.id === "starter" && c.opportunityIds.length === 0)
        );
        localStorage.setItem(storageKey(), JSON.stringify(parsed));
        localStorage.removeItem(LEGACY_KEY);
        return parsed;
      }
    } catch {}
  }
  return emptyState();
}

let state: State = load();

function persist() {
  try { localStorage.setItem(storageKey(), JSON.stringify(state)); } catch {}
  listeners.forEach((l) => l());
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

export const store = {
  setUser(uid: string | null) {
    const next = uid ?? "anon";
    if (next === userKey) return;
    userKey = next;
    state = load();
    listeners.forEach((l) => l());
  },
  toggleFavorite(id: string) {
    state = {
      ...state,
      favorites: state.favorites.includes(id)
        ? state.favorites.filter((x) => x !== id)
        : [...state.favorites, id],
    };
    persist();
  },
  removeFavorite(id: string) {
    if (!state.favorites.includes(id)) return;
    state = { ...state, favorites: state.favorites.filter((x) => x !== id) };
    persist();
  },
  isFavorite(id: string) {
    return state.favorites.includes(id);
  },
  createCollection(name: string, emoji = "✨") {
    const c: Collection = { id: crypto.randomUUID(), name, emoji, opportunityIds: [], createdAt: Date.now() };
    state = { ...state, collections: [...state.collections, c] };
    persist();
    return c;
  },
  deleteCollection(id: string) {
    state = { ...state, collections: state.collections.filter((c) => c.id !== id) };
    persist();
  },
  toggleInCollection(collectionId: string, oppId: string) {
    state = {
      ...state,
      collections: state.collections.map((c) => {
        if (c.id !== collectionId) return c;
        const has = c.opportunityIds.includes(oppId);
        return {
          ...c,
          opportunityIds: has
            ? c.opportunityIds.filter((x) => x !== oppId)
            : [...c.opportunityIds, oppId],
        };
      }),
    };
    persist();
  },
  removeFromCollection(collectionId: string, oppId: string) {
    state = {
      ...state,
      collections: state.collections.map((c) =>
        c.id === collectionId
          ? { ...c, opportunityIds: c.opportunityIds.filter((x) => x !== oppId) }
          : c
      ),
    };
    persist();
  },
};