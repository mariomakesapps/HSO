import { useEffect, useState, useSyncExternalStore } from "react";

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

const KEY = "atlas-collections-v1";
const listeners = new Set<() => void>();

function load(): State {
  if (typeof window === "undefined") return { favorites: [], collections: [] };
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    favorites: [],
    collections: [
      { id: "starter", name: "Dream Summer", emoji: "🌞", opportunityIds: [], createdAt: Date.now() },
    ],
  };
}

let state: State = load();

function persist() {
  localStorage.setItem(KEY, JSON.stringify(state));
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
  toggleFavorite(id: string) {
    state = {
      ...state,
      favorites: state.favorites.includes(id)
        ? state.favorites.filter((x) => x !== id)
        : [...state.favorites, id],
    };
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
};