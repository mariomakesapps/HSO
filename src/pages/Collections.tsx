import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Bookmark,
  Copy,
  ExternalLink,
  GripVertical,
  Heart,
  Link2,
  Lock,
  Plus,
  Search,
  Share2,
  Sparkles,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SiteFooter } from "@/components/SiteFooter";
import type { Opportunity } from "@/data/opportunities";
import { useSEO } from "@/lib/seo";
import { authRedirectHref, useAuthSession } from "@/hooks/useAuthSession";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { Collection, CollectionSummary, store, useStore } from "@/store/collections";

const coverGradients = [
  "linear-gradient(135deg, #132019 0%, #df6b54 48%, #d9eadf 100%)",
  "linear-gradient(135deg, #111827 0%, #274d3b 52%, #f4e8db 100%)",
  "linear-gradient(135deg, #0f3b2e 0%, #3ba172 48%, #f0c767 100%)",
  "linear-gradient(135deg, #f4eadf 0%, #df6b54 44%, #15251f 100%)",
];

const coverGradientNames = ["Coral signal", "Forest glass", "Green gold", "Cream ember"];

function listFromText(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function compactDate(value: number) {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric" }).format(new Date(value));
}

function coverStyle(collection: Pick<Collection, "cover_image" | "cover_gradient">) {
  return collection.cover_image
    ? { backgroundImage: `linear-gradient(135deg, rgba(16,24,39,0.25), rgba(255,118,92,0.2)), url(${collection.cover_image})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: collection.cover_gradient };
}

export default function Collections() {
  const shelf = useStore();
  const { user, loading } = useAuthSession();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab =
    tabParam === "shared" || tabParam === "explore" || tabParam === "mine" ? tabParam : "mine";
  const handleTabChange = (value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === "mine") next.delete("tab");
    else next.set("tab", value);
    setSearchParams(next, { replace: true });
  };
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [majors, setMajors] = useState("");
  const [categories, setCategories] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [coverGradient, setCoverGradient] = useState(coverGradients[0]);
  const [visibility, setVisibility] = useState<"only_me" | "anyone_with_link" | "public">("only_me");
  const [publicCollections, setPublicCollections] = useState<CollectionSummary[]>([]);
  const [sharedCollections, setSharedCollections] = useState<CollectionSummary[]>([]);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"trending" | "newest" | "saved">("trending");
  const [filter, setFilter] = useState("");
  const [dragging, setDragging] = useState<{ collectionId: string; opportunityId: string } | null>(null);
  const [opportunityById, setOpportunityById] = useState<Map<string, Opportunity> | null>(null);
  const debouncedQuery = useDebouncedValue(query, 180);
  const debouncedFilter = useDebouncedValue(filter, 180);
  const needsOpportunityLookup = !!user && shelf.collections.some((collection) => collection.opportunityIds.length > 0);

  useSEO({
    title: "Collections - HSO",
    description: "Create, share, publish, and explore HSO opportunity collections.",
  });

  const refreshExplore = async () => {
    try {
      const [publicRows, sharedRows] = await Promise.all([
        store.fetchPublicCollections(),
        user ? store.fetchSharedWithMe() : Promise.resolve([]),
      ]);
      setPublicCollections(publicRows);
      setSharedCollections(sharedRows);
    } catch (error: any) {
      toast.error(error.message ?? "Could not load collections");
    }
  };

  useEffect(() => {
    void refreshExplore();
  }, [user?.id]);

  useEffect(() => {
    if (!needsOpportunityLookup || opportunityById) return;
    let active = true;
    void import("@/data/opportunities").then(({ allOpportunities }) => {
      if (!active) return;
      setOpportunityById(new Map(allOpportunities.map((opportunity) => [opportunity.id, opportunity])));
    });
    return () => {
      active = false;
    };
  }, [needsOpportunityLookup, opportunityById]);

  const exploreCollections = publicCollections;

  const visiblePublic = useMemo(() => {
    const normalizedQuery = debouncedQuery.trim().toLowerCase();
    const normalizedFilter = debouncedFilter.trim().toLowerCase();
    const rows = exploreCollections.filter((collection) => {
      const haystack = [
        collection.title,
        collection.description,
        collection.owner_username,
        ...collection.tags,
        ...collection.intended_majors,
        ...collection.categories,
      ].join(" ").toLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      const matchesFilter = !normalizedFilter || haystack.includes(normalizedFilter);
      return matchesQuery && matchesFilter;
    });

    return rows.sort((a, b) => {
      if (sort === "newest") return b.updatedAt - a.updatedAt;
      if (sort === "saved") return b.bookmarksCount - a.bookmarksCount || b.likesCount - a.likesCount;
      return b.likesCount + b.bookmarksCount * 2 - (a.likesCount + a.bookmarksCount * 2);
    });
  }, [debouncedFilter, debouncedQuery, exploreCollections, sort]);

  const createCollection = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      navigate(authRedirectHref("/collections"));
      return;
    }
    if (!title.trim()) return;
    try {
      const isPublic = visibility === "public";
      await store.createCollection(title, "", {
        description,
        cover_image: coverImage.trim() || null,
        cover_gradient: coverGradient,
        tags: listFromText(tags),
        intended_majors: listFromText(majors),
        categories: listFromText(categories),
        visibility,
        is_published: isPublic,
      });
      setTitle("");
      setDescription("");
      setTags("");
      setMajors("");
      setCategories("");
      setCoverImage("");
      setCoverGradient(coverGradients[0]);
      setVisibility("only_me");
      toast.success("Collection created");
      void refreshExplore();
    } catch (error: any) {
      console.error("Create collection failed", error);
      toast.error("Collection could not be created. Please try again.");
    }
  };

  const dropOnItem = async (collection: Collection, targetOpportunityId: string) => {
    if (!dragging || dragging.collectionId !== collection.id || dragging.opportunityId === targetOpportunityId) return;
    const current = collection.opportunityIds.filter((id) => id !== dragging.opportunityId);
    const targetIndex = current.indexOf(targetOpportunityId);
    current.splice(Math.max(0, targetIndex), 0, dragging.opportunityId);
    setDragging(null);
    try {
      await store.reorderCollectionItems(collection.id, current);
    } catch (error: any) {
      toast.error(error.message ?? "Could not reorder collection");
    }
  };

  return (
    <div className="min-h-screen text-foreground">
      <main className="mx-auto w-full max-w-[1240px] px-4 pb-24 pt-8 md:px-6 md:pt-12">
        <section className="hso-glass-panel hso-surface-grid relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,hsl(var(--coral)/0.10),transparent_38%),linear-gradient(248deg,hsl(var(--sage)/0.10),transparent_42%)]" />
          <div className="hso-data-rail pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-80" />
          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-sage">Cloud Collections</p>
              <h1 className="mt-2 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink sm:text-6xl">
                Build shelves that travel with you.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Save programs into Supabase-backed collections, invite collaborators, publish public guides, and explore what other students are building.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <Stat value={shelf.collections.length} label="Mine" />
              <Stat value={sharedCollections.length} label="Shared" />
              <Stat value={exploreCollections.length} label="Public" />
            </div>
          </div>
        </section>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="mt-8">
          <TabsList className="hso-nav-shell h-auto flex-wrap rounded-full p-1">
            <TabsTrigger value="mine" className="rounded-full px-4 py-2 data-[state=active]:bg-ink data-[state=active]:text-cream">My Collections</TabsTrigger>
            <TabsTrigger value="shared" className="rounded-full px-4 py-2 data-[state=active]:bg-ink data-[state=active]:text-cream">Shared With Me</TabsTrigger>
            <TabsTrigger value="explore" className="rounded-full px-4 py-2 data-[state=active]:bg-ink data-[state=active]:text-cream">Explore Collections</TabsTrigger>
          </TabsList>

          <TabsContent value="mine" className="mt-6">
            {!loading && !user ? (
              <SignInPanel />
            ) : (
              <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
                <form onSubmit={createCollection} className="hso-glass-panel hso-surface-grid h-fit overflow-hidden rounded-[1.5rem] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-coral">New collection</p>
                  <div className="mt-4 space-y-3">
                    <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Dream STEM summer" className="rounded-xl" />
                    <Textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What this collection helps with..." className="min-h-24 rounded-xl" />
                    <Input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="Tags: STEM, NYC, free" className="rounded-xl" />
                    <Input value={majors} onChange={(event) => setMajors(event.target.value)} placeholder="Majors: CS, biology" className="rounded-xl" />
                    <Input value={categories} onChange={(event) => setCategories(event.target.value)} placeholder="Categories: internships, research" className="rounded-xl" />
                    <Input value={coverImage} onChange={(event) => setCoverImage(event.target.value)} placeholder="Cover image URL, optional" className="rounded-xl" />
                    <GradientPicker value={coverGradient} onChange={setCoverGradient} />
                    <VisibilityPicker value={visibility} onChange={setVisibility} />
                    <Button type="submit" className="w-full rounded-xl bg-ink text-cream hover:bg-coral">
                      <Plus className="mr-2 h-4 w-4" /> Create collection
                    </Button>
                  </div>
                </form>

                <div className="space-y-4">
                  {shelf.loading && <p className="text-sm text-muted-foreground">Syncing collections...</p>}
                  {shelf.collections.length === 0 && !shelf.loading && (
                    <EmptyState title="No cloud collections yet" body="Create your first collection, then add opportunities from cards or detail pages." />
                  )}
                  {shelf.collections.map((collection) => (
                    <EditableCollectionCard
                      key={collection.id}
                      collection={collection}
                      dragging={dragging}
                      setDragging={setDragging}
                      onDropItem={dropOnItem}
                      onRefresh={refreshExplore}
                      opportunityById={opportunityById}
                    />
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="shared" className="mt-6">
            {!user ? (
              <SignInPanel />
            ) : sharedCollections.length ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {sharedCollections.map((collection) => <ExploreCard key={collection.id} collection={collection} onRefresh={refreshExplore} />)}
              </div>
            ) : (
              <EmptyState title="Nothing shared with you yet" body="Collections shared by username will appear here with view or edit access." />
            )}
          </TabsContent>

          <TabsContent value="explore" className="mt-6">
            <div className="hso-glass-panel mb-5 grid gap-3 rounded-[1.5rem] p-4 lg:grid-cols-[1fr_180px_180px]">
              <label className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search public collections" className="rounded-xl pl-9" />
              </label>
              <select value={filter} onChange={(event) => setFilter(event.target.value)} className="h-10 rounded-xl border border-input bg-background px-3 text-sm">
                <option value="">All categories</option>
                <option value="research">Research</option>
                <option value="internship">Internship</option>
                <option value="stem">STEM</option>
                <option value="business">Business</option>
                <option value="cs">Computer Science</option>
                <option value="medicine">Medicine</option>
                <option value="engineering">Engineering</option>
                <option value="arts">Arts</option>
                <option value="policy">Policy</option>
                <option value="environment">Environment</option>
                <option value="math">Math</option>
                <option value="scholarship">Scholarship</option>
              </select>
              <select value={sort} onChange={(event) => setSort(event.target.value as any)} className="h-10 rounded-xl border border-input bg-background px-3 text-sm">
                <option value="trending">Trending</option>
                <option value="newest">Newest</option>
                <option value="saved">Most saved</option>
              </select>
            </div>

            {visiblePublic.length ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {visiblePublic.map((collection) => <ExploreCard key={collection.id} collection={collection} onRefresh={refreshExplore} />)}
              </div>
            ) : (
              <EmptyState title="No public collections match that" body="Try a broader search or come back after students publish more collections." />
            )}
          </TabsContent>
        </Tabs>
      </main>
      <SiteFooter />
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-white/70 bg-cream/58 px-4 py-3 shadow-[inset_0_1px_0_hsl(0_0%_100%/0.72)] backdrop-blur-md">
      <p className="font-display text-2xl font-semibold text-ink">{value}</p>
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{label}</p>
    </div>
  );
}

function SignInPanel() {
  return (
    <div className="hso-glass-panel hso-surface-grid overflow-hidden rounded-[1.5rem] p-8 text-center">
      <Lock className="mx-auto h-8 w-8 text-coral" />
      <h2 className="mt-3 font-display text-2xl font-semibold text-ink">Sign in to use cloud collections</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Collections now live in Supabase, so they sync across devices and accounts instead of staying in this browser.
      </p>
      <Link to={authRedirectHref("/collections")} className="mt-5 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-bold text-cream hover:bg-coral">
        Sign in
      </Link>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="hso-elevated-surface rounded-[1.5rem] border-dashed p-8 text-center">
      <Sparkles className="mx-auto h-7 w-7 text-coral" />
      <h2 className="mt-3 font-display text-2xl font-semibold text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function EditableCollectionCard({
  collection,
  dragging,
  setDragging,
  onDropItem,
  onRefresh,
  opportunityById,
}: {
  collection: Collection;
  dragging: { collectionId: string; opportunityId: string } | null;
  setDragging: (value: { collectionId: string; opportunityId: string } | null) => void;
  onDropItem: (collection: Collection, targetOpportunityId: string) => void;
  onRefresh: () => Promise<void>;
  opportunityById: Map<string, Opportunity> | null;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(collection.title);
  const [description, setDescription] = useState(collection.description);
  const [tags, setTags] = useState(collection.tags.join(", "));
  const [majors, setMajors] = useState(collection.intended_majors.join(", "));
  const [categories, setCategories] = useState(collection.categories.join(", "));
  const [coverImage, setCoverImage] = useState(collection.cover_image ?? "");
  const [coverGradient, setCoverGradient] = useState(collection.cover_gradient);
  const [invite, setInvite] = useState("");
  const [permission, setPermission] = useState<"view" | "edit">("view");

  useEffect(() => {
    setTitle(collection.title);
    setDescription(collection.description);
    setTags(collection.tags.join(", "));
    setMajors(collection.intended_majors.join(", "));
    setCategories(collection.categories.join(", "));
    setCoverImage(collection.cover_image ?? "");
    setCoverGradient(collection.cover_gradient);
  }, [collection]);

  const save = async () => {
    try {
      await store.updateCollection(collection.id, {
        title,
        description,
        cover_image: coverImage.trim() || null,
        cover_gradient: coverGradient,
        tags: listFromText(tags),
        intended_majors: listFromText(majors),
        categories: listFromText(categories),
      });
      setEditing(false);
      toast.success("Collection updated");
    } catch (error: any) {
      toast.error(error.message ?? "Could not update collection");
    }
  };

  const share = async () => {
    try {
      const url = await store.createShareLink(collection.id, "view");
      await navigator.clipboard.writeText(url);
      toast.success("Share link copied");
      await onRefresh();
    } catch (error: any) {
      toast.error(error.message ?? "Could not create share link");
    }
  };

  const inviteUser = async () => {
    try {
      await store.inviteUser(collection.id, invite, permission);
      setInvite("");
      toast.success("User invited");
    } catch (error: any) {
      toast.error(error.message ?? "Could not invite user");
    }
  };

  const publish = async () => {
    try {
      await store.togglePublish(collection.id, !collection.is_published);
      await onRefresh();
      toast.success(collection.is_published ? "Collection unpublished" : "Collection published on HSO");
    } catch (error: any) {
      toast.error(error.message ?? "Could not update publishing");
    }
  };

  return (
    <article className="hso-elevated-surface hso-surface-grid overflow-hidden rounded-[1.5rem]">
      <div className="h-24" style={coverStyle(collection)} />
      <div className="p-5">
        {editing ? (
          <div className="space-y-3">
            <Input value={title} onChange={(event) => setTitle(event.target.value)} className="rounded-xl" />
            <Textarea value={description} onChange={(event) => setDescription(event.target.value)} className="rounded-xl" />
            <Input value={tags} onChange={(event) => setTags(event.target.value)} placeholder="Tags" className="rounded-xl" />
            <Input value={majors} onChange={(event) => setMajors(event.target.value)} placeholder="Intended majors" className="rounded-xl" />
            <Input value={categories} onChange={(event) => setCategories(event.target.value)} placeholder="Categories" className="rounded-xl" />
            <Input value={coverImage} onChange={(event) => setCoverImage(event.target.value)} placeholder="Cover image URL" className="rounded-xl" />
            <GradientPicker value={coverGradient} onChange={setCoverGradient} />
            <div className="flex gap-2">
              <Button onClick={save} className="rounded-xl bg-ink text-cream hover:bg-coral">Save</Button>
              <Button onClick={() => setEditing(false)} variant="outline" className="rounded-xl">Cancel</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-2xl font-semibold text-ink">{collection.title}</h2>
                  <VisibilityBadge collection={collection} />
                </div>
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{collection.description || "No description yet."}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setEditing(true)} variant="outline" className="rounded-xl">Edit</Button>
                <Button onClick={share} variant="outline" className="rounded-xl"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
                <Button onClick={publish} className="rounded-xl bg-ink text-cream hover:bg-coral">
                  {collection.is_published ? "Unpublish" : "Publish"}
                </Button>
                <Button
                  onClick={() => { void store.deleteCollection(collection.id).catch((error: any) => toast.error(error.message ?? "Could not delete collection")); }}
                  variant="outline"
                  className="rounded-xl border-coral/30 text-coral hover:bg-coral/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {[...collection.tags, ...collection.intended_majors, ...collection.categories].slice(0, 10).map((tag) => (
                <span key={tag} className="rounded-full border border-white/65 bg-cream/70 px-3 py-1 text-xs font-semibold text-ink">{tag}</span>
              ))}
            </div>

            <div className="mt-5 grid gap-3 rounded-2xl border border-border/60 bg-cream/45 p-3 md:grid-cols-[1fr_auto_auto]">
              <Input value={invite} onChange={(event) => setInvite(event.target.value)} placeholder="Invite by HSO username" className="rounded-xl" />
              <select value={permission} onChange={(event) => setPermission(event.target.value as any)} className="h-10 rounded-xl border border-input bg-background px-3 text-sm">
                <option value="view">Can view</option>
                <option value="edit">Can edit</option>
              </select>
              <Button onClick={inviteUser} variant="outline" className="rounded-xl"><Users className="mr-2 h-4 w-4" /> Invite</Button>
            </div>

            <div className="mt-5 space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">{collection.opportunityIds.length} opportunities</p>
              {collection.opportunityIds.length === 0 ? (
                <p className="rounded-xl border border-dashed border-border bg-cream/45 p-4 text-sm text-muted-foreground">Add opportunities from any opportunity card.</p>
              ) : (
                collection.opportunityIds.map((id) => {
                  const opportunity = opportunityById?.get(id);
                  if (!opportunity) return null;
                  return (
                    <div
                      key={id}
                      draggable
                      onDragStart={() => setDragging({ collectionId: collection.id, opportunityId: id })}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => onDropItem(collection, id)}
                      className={`flex items-center gap-3 rounded-xl border border-border/60 bg-cream/60 px-3 py-2 text-sm transition-colors ${dragging?.opportunityId === id ? "opacity-50" : ""}`}
                    >
                      <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <Link to={`/opportunities/${id}`} className="min-w-0 flex-1 truncate font-semibold text-ink hover:text-coral">
                        {opportunity.title}
                      </Link>
                      <button
                        type="button"
                        onClick={() => { void store.removeFromCollection(collection.id, id).catch((error: any) => toast.error(error.message ?? "Could not remove item")); }}
                        className="rounded-lg p-1 text-muted-foreground hover:bg-coral/10 hover:text-coral"
                        aria-label={`Remove ${opportunity.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </article>
  );
}

function VisibilityBadge({ collection }: { collection: Collection }) {
  const label = collection.is_published
    ? "Public on HSO"
    : collection.visibility === "anyone_with_link"
      ? "Anyone with link"
      : collection.visibility === "specific_people"
        ? "Specific people"
        : "Only me";
  const Icon = collection.is_published ? Sparkles : collection.visibility === "only_me" ? Lock : collection.visibility === "anyone_with_link" ? Link2 : Users;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/65 bg-cream/70 px-2.5 py-1 text-[11px] font-bold text-muted-foreground">
      <Icon className="h-3.5 w-3.5" /> {label}
    </span>
  );
}

function GradientPicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Cover gradient</p>
      <div className="grid grid-cols-2 gap-2">
        {coverGradients.map((gradient, index) => {
          const active = value === gradient;
          return (
            <button
              key={gradient}
              type="button"
              onClick={() => onChange(gradient)}
              className={`group rounded-2xl border p-1.5 text-left transition-all hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-24px_hsl(var(--ink)/0.55)] ${
                active ? "border-ink bg-cream shadow-[0_16px_34px_-26px_hsl(var(--ink)/0.65)]" : "border-border/70 bg-background/70"
              }`}
              aria-pressed={active}
            >
              <span className="block h-12 rounded-xl border border-white/45 shadow-[inset_0_1px_0_hsl(0_0%_100%/0.35)]" style={{ background: gradient }} />
              <span className="mt-2 flex items-center justify-between gap-2 px-1 pb-0.5 text-xs font-bold text-ink">
                {coverGradientNames[index]}
                <span className={`h-2 w-2 rounded-full ${active ? "bg-coral" : "bg-border"}`} />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ExploreCard({ collection, onRefresh }: { collection: CollectionSummary; onRefresh: () => Promise<void> }) {
  const { user } = useAuthSession();
  const navigate = useNavigate();
  const isSample = collection.id.startsWith("sample-");

  const toggleLike = async () => {
    if (isSample) {
      toast.success("This is an HSO recommended folder. Open it to browse the programs.");
      return;
    }
    if (!user) {
      navigate(authRedirectHref("/collections"));
      return;
    }
    try {
      await store.toggleCollectionLike(collection.id, collection.likedByMe);
      await onRefresh();
    } catch (error: any) {
      toast.error(error.message ?? "Could not update like");
    }
  };

  const toggleBookmark = async () => {
    if (isSample) {
      toast.success("This is an HSO recommended folder. Open it to browse the programs.");
      return;
    }
    if (!user) {
      navigate(authRedirectHref("/collections"));
      return;
    }
    try {
      await store.toggleCollectionBookmark(collection.id, collection.bookmarkedByMe);
      await onRefresh();
    } catch (error: any) {
      toast.error(error.message ?? "Could not update bookmark");
    }
  };

  const copyPublicLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/collections/${collection.id}`);
    toast.success("Collection link copied");
  };

  return (
    <article className="hso-elevated-surface hso-surface-grid overflow-hidden rounded-[1.5rem] transition-transform hover:-translate-y-1">
      <div className="h-28" style={coverStyle(collection)} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link to={`/collections/${collection.id}`} className="font-display text-2xl font-semibold leading-tight text-ink hover:text-coral">
              {collection.title}
            </Link>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">@{collection.owner_username}</p>
          </div>
          <button onClick={copyPublicLink} className="rounded-full border border-border bg-cream/70 p-2 text-muted-foreground hover:text-coral" aria-label="Copy collection link">
            <Copy className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{collection.description || "Student-built HSO opportunity collection."}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {[...collection.tags, ...collection.intended_majors, ...collection.categories].slice(0, 5).map((tag) => (
            <span key={tag} className="rounded-full bg-coral/10 px-2.5 py-1 text-[11px] font-bold text-coral">{tag}</span>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4 text-xs font-semibold text-muted-foreground">
          <span>{collection.itemCount} opportunities</span>
          <span>Updated {compactDate(collection.updatedAt)}</span>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <Button onClick={toggleLike} variant="outline" size="sm" className="rounded-full">
            <Heart className={`mr-1.5 h-4 w-4 ${collection.likedByMe ? "fill-coral text-coral" : ""}`} /> {collection.likesCount}
          </Button>
          <Button onClick={toggleBookmark} variant="outline" size="sm" className="rounded-full">
            <Bookmark className={`mr-1.5 h-4 w-4 ${collection.bookmarkedByMe ? "fill-coral text-coral" : ""}`} /> {collection.bookmarksCount}
          </Button>
          <Link to={`/collections/${collection.id}`} className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-bold text-cream hover:bg-coral">
            Open <ExternalLink className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
