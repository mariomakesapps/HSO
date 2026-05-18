import { useSyncExternalStore } from "react";
import { supabase } from "@/integrations/supabase/client";

export type CollectionVisibility = "only_me" | "anyone_with_link" | "specific_people" | "public";
export type CollectionPermission = "view" | "edit";

export type Collection = {
  id: string;
  owner_id: string;
  name: string;
  title: string;
  description: string;
  cover_image: string | null;
  cover_gradient: string;
  visibility: CollectionVisibility;
  is_published: boolean;
  tags: string[];
  intended_majors: string[];
  categories: string[];
  opportunityIds: string[];
  createdAt: number;
  updatedAt: number;
};

export type CollectionSummary = Collection & {
  owner_username?: string;
  permission?: CollectionPermission;
  itemCount: number;
  likesCount: number;
  bookmarksCount: number;
  likedByMe: boolean;
  bookmarkedByMe: boolean;
};

type State = {
  favorites: string[];
  collections: Collection[];
  loading: boolean;
  error: string | null;
};

const db = supabase as any;
const listeners = new Set<() => void>();
const gradients = [
  "linear-gradient(135deg, #ff765c 0%, #2fbf82 100%)",
  "linear-gradient(135deg, #101827 0%, #ff765c 55%, #f6e7d7 100%)",
  "linear-gradient(135deg, #0b3b2e 0%, #2fbf82 50%, #f7c65f 100%)",
  "linear-gradient(135deg, #f6e7d7 0%, #ff765c 45%, #1a2f2a 100%)",
];

let userId: string | null = null;
let realtimeChannel: any = null;
let reloadTimer: number | undefined;
let cloudMode: "database" | "profile" = "database";

let state: State = {
  favorites: [],
  collections: [],
  loading: false,
  error: null,
};

function emit() {
  listeners.forEach((listener) => listener());
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

export function useCollections() {
  return useSyncExternalStore(subscribe, () => state.collections, () => state.collections);
}

export function useShelfCount() {
  return useSyncExternalStore(
    subscribe,
    () => state.favorites.length + state.collections.reduce((n, c) => n + c.opportunityIds.length, 0),
    () => state.favorites.length + state.collections.reduce((n, c) => n + c.opportunityIds.length, 0),
  );
}

function toMillis(value: string | null | undefined) {
  const time = value ? new Date(value).getTime() : Date.now();
  return Number.isFinite(time) ? time : Date.now();
}

function mapCollection(row: any, items: any[] = []): Collection {
  const opportunityIds = items
    .filter((item) => item.collection_id === row.id && item.opportunity_id)
    .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
    .map((item) => item.opportunity_id);

  return {
    id: row.id,
    owner_id: row.owner_id,
    name: row.title,
    title: row.title,
    description: row.description ?? "",
    cover_image: row.cover_image ?? null,
    cover_gradient: row.cover_gradient ?? gradients[0],
    visibility: row.visibility ?? "only_me",
    is_published: !!row.is_published,
    tags: row.tags ?? [],
    intended_majors: row.intended_majors ?? [],
    categories: row.categories ?? [],
    opportunityIds,
    createdAt: toMillis(row.created_at),
    updatedAt: toMillis(row.updated_at),
  };
}

function isMissingCloudTable(error: any) {
  const message = String(error?.message ?? "").toLowerCase();
  return (
    error?.code === "PGRST205" ||
    error?.code === "42P01" ||
    (message.includes("could not find the table") && message.includes("schema cache")) ||
    message.includes("relation") && message.includes("does not exist")
  );
}

function mapProfileCollection(row: any): Collection {
  const now = Date.now();
  return {
    id: row.id ?? crypto.randomUUID(),
    owner_id: row.owner_id ?? userId ?? "",
    name: row.title ?? row.name ?? "Untitled collection",
    title: row.title ?? row.name ?? "Untitled collection",
    description: row.description ?? "",
    cover_image: row.cover_image ?? null,
    cover_gradient: row.cover_gradient ?? gradients[0],
    visibility: row.visibility ?? "only_me",
    is_published: !!row.is_published,
    tags: row.tags ?? [],
    intended_majors: row.intended_majors ?? [],
    categories: row.categories ?? [],
    opportunityIds: row.opportunityIds ?? row.opportunity_ids ?? [],
    createdAt: row.createdAt ?? row.created_at ?? now,
    updatedAt: row.updatedAt ?? row.updated_at ?? now,
  };
}

async function loadProfileCloudState() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    setState({ loading: false, error: error.message });
    return;
  }

  const metadata = data.user?.user_metadata ?? {};
  const collections = Array.isArray(metadata.hso_collections) ? metadata.hso_collections.map(mapProfileCollection) : [];
  const favorites = Array.isArray(metadata.hso_favorites) ? metadata.hso_favorites.filter(Boolean) : [];

  setState({
    favorites,
    collections,
    loading: false,
    error: null,
  });
}

async function saveProfileCloudState(next: Pick<State, "favorites" | "collections">) {
  const profileCollections = next.collections.map((collection) => ({
    id: collection.id,
    owner_id: collection.owner_id,
    title: collection.title,
    description: collection.description,
    cover_image: collection.cover_image,
    cover_gradient: collection.cover_gradient,
    visibility: collection.visibility,
    is_published: collection.is_published,
    tags: collection.tags,
    intended_majors: collection.intended_majors,
    categories: collection.categories,
    opportunityIds: collection.opportunityIds,
    createdAt: collection.createdAt,
    updatedAt: collection.updatedAt,
  }));

  const { error } = await supabase.auth.updateUser({
    data: {
      hso_favorites: next.favorites,
      hso_collections: profileCollections,
    },
  });
  if (error) throw error;
}

function collectionPayload(collection: Partial<Collection> & { title?: string; name?: string }, withDefaults = false) {
  const payload: Record<string, unknown> = {};
  const title = collection.title ?? collection.name;
  if (title !== undefined) payload.title = title;
  if (collection.description !== undefined || withDefaults) payload.description = collection.description ?? "";
  if (collection.cover_image !== undefined || withDefaults) payload.cover_image = collection.cover_image ?? null;
  if (collection.cover_gradient !== undefined || withDefaults) {
    payload.cover_gradient = collection.cover_gradient ?? gradients[Math.floor(Math.random() * gradients.length)];
  }
  if (collection.visibility !== undefined || withDefaults) payload.visibility = collection.visibility ?? "only_me";
  if (collection.is_published !== undefined || withDefaults) payload.is_published = collection.is_published ?? false;
  if (collection.tags !== undefined || withDefaults) payload.tags = collection.tags ?? [];
  if (collection.intended_majors !== undefined || withDefaults) payload.intended_majors = collection.intended_majors ?? [];
  if (collection.categories !== undefined || withDefaults) payload.categories = collection.categories ?? [];
  return payload;
}

async function loadCloudState() {
  if (!userId) {
    setState({ favorites: [], collections: [], loading: false, error: null });
    return;
  }

  setState({ loading: true, error: null });

  const [collectionsRes, savesRes] = await Promise.all([
    db.from("collections").select("*").eq("owner_id", userId).order("updated_at", { ascending: false }),
    db.from("saved_opportunities").select("opportunity_id").eq("user_id", userId),
  ]);

  if (collectionsRes.error) {
    if (isMissingCloudTable(collectionsRes.error)) {
      cloudMode = "profile";
      await loadProfileCloudState();
      return;
    }
    setState({ loading: false, error: collectionsRes.error.message });
    return;
  }

  if (savesRes.error) {
    if (isMissingCloudTable(savesRes.error)) {
      cloudMode = "profile";
      await loadProfileCloudState();
      return;
    }
    setState({ loading: false, error: savesRes.error.message });
    return;
  }

  const collectionRows = collectionsRes.data ?? [];
  const collectionIds = collectionRows.map((collection: any) => collection.id);
  let items: any[] = [];

  if (collectionIds.length) {
    const itemsRes = await db
      .from("collection_items")
      .select("*")
      .in("collection_id", collectionIds)
      .order("position", { ascending: true });
    if (itemsRes.error) {
      setState({ loading: false, error: itemsRes.error.message });
      return;
    }
    items = itemsRes.data ?? [];
  }

  setState({
    favorites: (savesRes.data ?? []).map((item: any) => item.opportunity_id).filter(Boolean),
    collections: collectionRows.map((row: any) => mapCollection(row, items)),
    loading: false,
    error: null,
  });
  cloudMode = "database";
}

function scheduleReload() {
  if (typeof window === "undefined") return;
  window.clearTimeout(reloadTimer);
  reloadTimer = window.setTimeout(() => {
    void loadCloudState();
  }, 250);
}

function subscribeRealtime() {
  if (realtimeChannel) {
    supabase.removeChannel(realtimeChannel);
    realtimeChannel = null;
  }
  if (!userId) return;

  realtimeChannel = supabase
    .channel(`hso-collections-${userId}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "collections", filter: `owner_id=eq.${userId}` }, scheduleReload)
    .on("postgres_changes", { event: "*", schema: "public", table: "saved_opportunities", filter: `user_id=eq.${userId}` }, scheduleReload)
    .on("postgres_changes", { event: "*", schema: "public", table: "collection_items" }, scheduleReload)
    .subscribe();
}

async function requireUser() {
  if (userId) return userId;
  const { data } = await supabase.auth.getUser();
  userId = data.user?.id ?? null;
  if (!userId) throw new Error("Sign in to use cloud collections.");
  return userId;
}

async function enrichCollections(rows: any[], currentUserId = userId): Promise<CollectionSummary[]> {
  const ids = rows.map((row) => row.id);
  if (!ids.length) return [];

  const ownerIds = [...new Set(rows.map((row) => row.owner_id).filter(Boolean))];
  const [itemsRes, usersRes, likesRes, bookmarksRes] = await Promise.all([
    db.from("collection_items").select("*").in("collection_id", ids),
    ownerIds.length ? db.from("users").select("id, username, avatar_url").in("id", ownerIds) : Promise.resolve({ data: [], error: null }),
    db.from("collection_likes").select("collection_id,user_id").in("collection_id", ids),
    currentUserId
      ? db.from("collection_bookmarks").select("collection_id,user_id").in("collection_id", ids)
      : Promise.resolve({ data: [], error: null }),
  ]);

  const items = itemsRes.data ?? [];
  const users = new Map((usersRes.data ?? []).map((user: any) => [user.id, user]));
  const likes = likesRes.data ?? [];
  const bookmarks = bookmarksRes.data ?? [];

  return rows.map((row) => {
    const collection = mapCollection(row, items);
    const owner = users.get(row.owner_id);
    return {
      ...collection,
      owner_username: owner?.username ?? "HSO student",
      itemCount: items.filter((item: any) => item.collection_id === row.id).length,
      likesCount: likes.filter((item: any) => item.collection_id === row.id).length,
      bookmarksCount: bookmarks.filter((item: any) => item.collection_id === row.id).length,
      likedByMe: !!currentUserId && likes.some((item: any) => item.collection_id === row.id && item.user_id === currentUserId),
      bookmarkedByMe: !!currentUserId && bookmarks.some((item: any) => item.collection_id === row.id && item.user_id === currentUserId),
    };
  });
}

export const store = {
  setUser(uid: string | null) {
    if (uid === userId) return;
    userId = uid;
    if (!uid) {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
        realtimeChannel = null;
      }
      setState({ favorites: [], collections: [], loading: false, error: null });
      return;
    }
    subscribeRealtime();
    void loadCloudState();
  },

  async reload() {
    await loadCloudState();
  },

  async toggleFavorite(id: string) {
    const uid = await requireUser();
    const exists = state.favorites.includes(id);
    const previous = state;
    const nextFavorites = exists ? state.favorites.filter((item) => item !== id) : [...state.favorites, id];
    setState({ favorites: nextFavorites });

    if (cloudMode === "profile") {
      try {
        await saveProfileCloudState({ favorites: nextFavorites, collections: state.collections });
      } catch (error) {
        setState(previous);
        throw error;
      }
      return;
    }

    const result = exists
      ? await db.from("saved_opportunities").delete().eq("user_id", uid).eq("opportunity_id", id)
      : await db.from("saved_opportunities").upsert({ user_id: uid, opportunity_id: id }, { onConflict: "user_id,opportunity_id" });

    if (result.error) {
      if (isMissingCloudTable(result.error)) {
        cloudMode = "profile";
        await saveProfileCloudState({ favorites: nextFavorites, collections: state.collections });
        return;
      }
      await loadCloudState();
      throw result.error;
    }
  },

  async removeFavorite(id: string) {
    if (!state.favorites.includes(id)) return;
    const uid = await requireUser();
    const previous = state;
    const nextFavorites = state.favorites.filter((item) => item !== id);
    setState({ favorites: nextFavorites });
    if (cloudMode === "profile") {
      try {
        await saveProfileCloudState({ favorites: nextFavorites, collections: state.collections });
      } catch (error) {
        setState(previous);
        throw error;
      }
      return;
    }
    const { error } = await db.from("saved_opportunities").delete().eq("user_id", uid).eq("opportunity_id", id);
    if (error) {
      if (isMissingCloudTable(error)) {
        cloudMode = "profile";
        await saveProfileCloudState({ favorites: nextFavorites, collections: state.collections });
        return;
      }
      await loadCloudState();
      throw error;
    }
  },

  isFavorite(id: string) {
    return state.favorites.includes(id);
  },

  async createCollection(name: string, _emoji = "", options: Partial<Collection> = {}) {
    const uid = await requireUser();
    const title = name.trim();
    if (!title) return null;

    const tempId = `temp-${crypto.randomUUID()}`;
    const temp: Collection = {
      id: tempId,
      owner_id: uid,
      name: title,
      title,
      description: options.description ?? "",
      cover_image: options.cover_image ?? null,
      cover_gradient: options.cover_gradient ?? gradients[state.collections.length % gradients.length],
      visibility: options.visibility ?? "only_me",
      is_published: options.is_published ?? false,
      tags: options.tags ?? [],
      intended_majors: options.intended_majors ?? [],
      categories: options.categories ?? [],
      opportunityIds: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setState({ collections: [temp, ...state.collections] });

    if (cloudMode === "profile") {
      const saved = { ...temp, id: crypto.randomUUID(), createdAt: Date.now(), updatedAt: Date.now() };
      const nextCollections = [saved, ...state.collections.filter((collection) => collection.id !== tempId)];
      try {
        await saveProfileCloudState({ favorites: state.favorites, collections: nextCollections });
        setState({ collections: nextCollections, error: null });
        return saved;
      } catch (error: any) {
        setState({ collections: state.collections.filter((collection) => collection.id !== tempId), error: error.message });
        throw error;
      }
    }

    const { data, error } = await db
      .from("collections")
      .insert({ owner_id: uid, ...collectionPayload(temp, true) })
      .select()
      .single();

    if (error) {
      if (isMissingCloudTable(error)) {
        cloudMode = "profile";
        const saved = { ...temp, id: crypto.randomUUID(), createdAt: Date.now(), updatedAt: Date.now() };
        const nextCollections = [saved, ...state.collections.filter((collection) => collection.id !== tempId)];
        try {
          await saveProfileCloudState({ favorites: state.favorites, collections: nextCollections });
          setState({ collections: nextCollections, error: null });
          return saved;
        } catch (profileError: any) {
          setState({ collections: state.collections.filter((collection) => collection.id !== tempId), error: profileError.message });
          throw profileError;
        }
      }
      setState({ collections: state.collections.filter((collection) => collection.id !== tempId), error: error.message });
      throw error;
    }

    const saved = mapCollection(data, []);
    setState({ collections: state.collections.map((collection) => (collection.id === tempId ? saved : collection)) });
    return saved;
  },

  async updateCollection(id: string, updates: Partial<Collection>) {
    if (cloudMode === "profile") {
      const current = state.collections.find((collection) => collection.id === id);
      if (!current) return null;
      const next = { ...current, ...updates, title: updates.title ?? updates.name ?? current.title, updatedAt: Date.now() };
      const nextCollections = state.collections.map((collection) => (collection.id === id ? next : collection));
      await saveProfileCloudState({ favorites: state.favorites, collections: nextCollections });
      setState({ collections: nextCollections, error: null });
      return next;
    }
    const payload = collectionPayload(updates);
    const { data, error } = await db.from("collections").update(payload).eq("id", id).select().single();
    if (error) throw error;
    const current = state.collections.find((collection) => collection.id === id);
    const next = mapCollection(data, current?.opportunityIds.map((opportunity_id, position) => ({ collection_id: id, opportunity_id, position })) ?? []);
    setState({ collections: state.collections.map((collection) => (collection.id === id ? next : collection)) });
    return next;
  },

  async deleteCollection(id: string) {
    const previous = state.collections;
    setState({ collections: previous.filter((collection) => collection.id !== id) });
    if (cloudMode === "profile") {
      try {
        await saveProfileCloudState({ favorites: state.favorites, collections: state.collections });
      } catch (error: any) {
        setState({ collections: previous, error: error.message });
        throw error;
      }
      return;
    }
    const { error } = await db.from("collections").delete().eq("id", id);
    if (error) {
      setState({ collections: previous, error: error.message });
      throw error;
    }
  },

  async toggleInCollection(collectionId: string, oppId: string) {
    const collection = state.collections.find((item) => item.id === collectionId);
    if (!collection) return;
    const exists = collection.opportunityIds.includes(oppId);
    const previous = state.collections;
    const nextIds = exists
      ? collection.opportunityIds.filter((id) => id !== oppId)
      : [...collection.opportunityIds, oppId];
    setState({
      collections: state.collections.map((item) => (item.id === collectionId ? { ...item, opportunityIds: nextIds } : item)),
    });

    if (cloudMode === "profile") {
      try {
        await saveProfileCloudState({ favorites: state.favorites, collections: state.collections });
      } catch (error: any) {
        setState({ collections: previous, error: error.message });
        throw error;
      }
      return;
    }

    const result = exists
      ? await db.from("collection_items").delete().eq("collection_id", collectionId).eq("opportunity_id", oppId)
      : await db
          .from("collection_items")
          .upsert(
            { collection_id: collectionId, opportunity_id: oppId, position: collection.opportunityIds.length },
            { onConflict: "collection_id,opportunity_id" },
          );

    if (result.error) {
      setState({ collections: previous, error: result.error.message });
      throw result.error;
    }
  },

  async removeFromCollection(collectionId: string, oppId: string) {
    const collection = state.collections.find((item) => item.id === collectionId);
    if (!collection || !collection.opportunityIds.includes(oppId)) return;
    await this.toggleInCollection(collectionId, oppId);
  },

  async reorderCollectionItems(collectionId: string, orderedOpportunityIds: string[]) {
    const previous = state.collections;
    setState({
      collections: state.collections.map((collection) =>
        collection.id === collectionId ? { ...collection, opportunityIds: orderedOpportunityIds } : collection,
      ),
    });

    if (cloudMode === "profile") {
      try {
        await saveProfileCloudState({ favorites: state.favorites, collections: state.collections });
      } catch (error: any) {
        setState({ collections: previous, error: error.message });
        throw error;
      }
      return;
    }

    const updates = orderedOpportunityIds.map((opportunity_id, position) =>
      db.from("collection_items").update({ position }).eq("collection_id", collectionId).eq("opportunity_id", opportunity_id),
    );
    const results = await Promise.all(updates);
    const error = results.find((result) => result.error)?.error;
    if (error) {
      setState({ collections: previous, error: error.message });
      throw error;
    }
  },

  async createShareLink(collectionId: string, permission: CollectionPermission = "view") {
    if (cloudMode === "profile") {
      throw new Error("Public sharing turns on after the full Supabase collections tables are installed.");
    }
    const { data, error } = await db.rpc("create_collection_share_link", {
      p_collection_id: collectionId,
      p_permission: permission,
      p_expires_at: null,
    });
    if (error) throw error;
    await loadCloudState();
    const token = data?.share_token;
    return token ? `${window.location.origin}/collections/share/${token}` : "";
  },

  async inviteUser(collectionId: string, username: string, permission: CollectionPermission) {
    if (cloudMode === "profile") {
      throw new Error("Invites turn on after the full Supabase collections tables are installed.");
    }
    const clean = username.trim();
    if (!clean) return;
    const { data: user, error: userError } = await db.from("users").select("id").eq("username", clean).single();
    if (userError) throw new Error("No HSO user found with that username.");
    const { error } = await db
      .from("collection_shares")
      .upsert(
        { collection_id: collectionId, shared_with_user_id: user.id, permission },
        { onConflict: "collection_id,shared_with_user_id" },
      );
    if (error) throw error;
    await db.from("collections").update({ visibility: "specific_people" }).eq("id", collectionId);
  },

  async togglePublish(collectionId: string, publish: boolean) {
    if (cloudMode === "profile") {
      throw new Error("Publishing turns on after the full Supabase collections tables are installed.");
    }
    const { error } = await db
      .from("collections")
      .update({ visibility: publish ? "public" : "only_me", is_published: publish })
      .eq("id", collectionId);
    if (error) throw error;
    await loadCloudState();
  },

  async fetchPublicCollections() {
    const { data, error } = await db
      .from("collections")
      .select("*")
      .eq("visibility", "public")
      .eq("is_published", true)
      .order("updated_at", { ascending: false });
    if (error) {
      if (isMissingCloudTable(error)) {
        cloudMode = "profile";
        return [];
      }
      throw error;
    }
    return enrichCollections(data ?? []);
  },

  async fetchSharedWithMe() {
    if (cloudMode === "profile") return [];
    const uid = await requireUser();
    const { data: shares, error } = await db
      .from("collection_shares")
      .select("collection_id, permission")
      .eq("shared_with_user_id", uid);
    if (error) {
      if (isMissingCloudTable(error)) {
        cloudMode = "profile";
        return [];
      }
      throw error;
    }
    const ids = (shares ?? []).map((share: any) => share.collection_id);
    if (!ids.length) return [];
    const { data, error: collectionError } = await db.from("collections").select("*").in("id", ids);
    if (collectionError) {
      if (isMissingCloudTable(collectionError)) {
        cloudMode = "profile";
        return [];
      }
      throw collectionError;
    }
    const enriched = await enrichCollections(data ?? [], uid);
    return enriched.map((collection) => ({
      ...collection,
      permission: (shares ?? []).find((share: any) => share.collection_id === collection.id)?.permission ?? "view",
    }));
  },

  async toggleCollectionLike(collectionId: string, liked: boolean) {
    if (cloudMode === "profile") {
      throw new Error("Collection likes turn on after the full Supabase collections tables are installed.");
    }
    const uid = await requireUser();
    const result = liked
      ? await db.from("collection_likes").delete().eq("collection_id", collectionId).eq("user_id", uid)
      : await db.from("collection_likes").upsert({ collection_id: collectionId, user_id: uid }, { onConflict: "collection_id,user_id" });
    if (result.error) throw result.error;
  },

  async toggleCollectionBookmark(collectionId: string, bookmarked: boolean) {
    if (cloudMode === "profile") {
      throw new Error("Collection bookmarks turn on after the full Supabase collections tables are installed.");
    }
    const uid = await requireUser();
    const result = bookmarked
      ? await db.from("collection_bookmarks").delete().eq("collection_id", collectionId).eq("user_id", uid)
      : await db.from("collection_bookmarks").upsert({ collection_id: collectionId, user_id: uid }, { onConflict: "collection_id,user_id" });
    if (result.error) throw result.error;
  },
};
