import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, BookmarkCheck, Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/SiteFooter";
import { useSEO } from "@/lib/seo";
import { useAuthSession } from "@/hooks/useAuthSession";
import {
  careerPaths,
  collectionCategories,
  curatedCollections,
  curatedSections,
  intendedMajors,
  type CuratedCollection,
} from "@/data/curatedCollections";
import {
  loadCuratedCounts,
  store,
  useCuratedCounts,
  useCuratedLikedStatus,
  useCuratedSavedStatus,
} from "@/store/collections";

type SortKey = "featured" | "most-liked" | "most-saved";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "most-liked", label: "Most liked" },
  { key: "most-saved", label: "Most saved" },
];

function signInRequiredToast(navigate: ReturnType<typeof useNavigate>, returnTo: string) {
  toast.error("Sign-in required", {
    description: "Create a free HSO account to like or save collections.",
    action: {
      label: "Sign in",
      onClick: () => navigate(`/auth?redirect=${encodeURIComponent(returnTo)}`),
    },
  });
}

export default function Collections() {
  useSEO({
    title: "Curated Collections - HSO",
    description: "Hand-picked opportunity lists for different majors, careers, and goals.",
  });

  useEffect(() => {
    void loadCuratedCounts();
  }, []);

  const counts = useCuratedCounts();

  const [major, setMajor] = useState<string>("All");
  const [career, setCareer] = useState<string>("All");
  const [type, setType] = useState<string>("All");
  const [sort, setSort] = useState<SortKey>("featured");

  const filtered = useMemo<CuratedCollection[]>(() => {
    const base = curatedCollections.filter((c) => {
      if (c.is_active === false) return false;
      if (major !== "All" && !c.intended_majors.includes(major)) return false;
      if (career !== "All" && c.career_path !== career) return false;
      if (type !== "All" && !c.categories.includes(type)) return false;
      return true;
    });
    if (sort === "most-liked") {
      return base.slice().sort((a, b) => (counts[b.id]?.likes ?? 0) - (counts[a.id]?.likes ?? 0));
    }
    if (sort === "most-saved") {
      return base.slice().sort((a, b) => (counts[b.id]?.saves ?? 0) - (counts[a.id]?.saves ?? 0));
    }
    return base;
  }, [major, career, type, sort, counts]);

  const filtersActive = major !== "All" || career !== "All" || type !== "All" || sort !== "featured";

  return (
    <div className="min-h-screen text-foreground">
      <main className="mx-auto w-full max-w-[1240px] px-4 pb-24 pt-8 md:px-6 md:pt-12">
        <section className="hso-glass-panel hso-surface-grid relative overflow-hidden rounded-[2rem] p-6 sm:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,hsl(var(--coral)/0.10),transparent_38%),linear-gradient(248deg,hsl(var(--sage)/0.10),transparent_42%)]" />
          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-sage">HSO Editors</p>
            <h1 className="mt-2 max-w-3xl font-display text-4xl font-semibold tracking-tight text-ink sm:text-6xl">
              Curated Collections
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Focused opportunity lists for different majors, careers, and goals.
            </p>
          </div>
        </section>

        <div className="mt-8 rounded-[1.5rem] border border-border bg-card/70 p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <FilterSelect label="Major" value={major} onChange={setMajor} options={intendedMajors} />
            <FilterSelect label="Career path" value={career} onChange={setCareer} options={careerPaths} />
            <FilterSelect label="Type" value={type} onChange={setType} options={collectionCategories} />
            <div>
              <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">Sort</label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-ink"
              >
                {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>{filtered.length} {filtered.length === 1 ? "collection" : "collections"}</span>
            {filtersActive && (
              <button
                type="button"
                onClick={() => { setMajor("All"); setCareer("All"); setType("All"); setSort("featured"); }}
                className="font-semibold text-coral hover:underline"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {filtersActive ? (
          <section className="mt-8">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filtered.map((collection) => (
                <CuratedCard key={collection.id} collection={collection} />
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="mt-6 rounded-[1.5rem] border border-dashed border-border bg-card/60 p-8 text-center text-sm text-muted-foreground">
                No collections match those filters yet.
              </div>
            )}
          </section>
        ) : (
          <div className="mt-10 space-y-14">
            {curatedSections.map((section) => {
              const visible = section.collections.filter((c) => c.is_active !== false);
              if (!visible.length) return null;
              return (
            <section key={section.id} aria-labelledby={`section-${section.id}`}>
              <div className="flex items-end justify-between gap-4">
                <h2 id={`section-${section.id}`} className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                  {section.title}
                </h2>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  {visible.length} {visible.length === 1 ? "collection" : "collections"}
                </span>
              </div>
              <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {visible.map((collection) => (
                  <CuratedCard key={collection.id} collection={collection} />
                ))}
              </div>
            </section>
              );
            })}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-ink"
      >
        <option value="All">All</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function CuratedCard({ collection }: { collection: CuratedCollection }) {
  const { user } = useAuthSession();
  const navigate = useNavigate();
  const saved = useCuratedSavedStatus(collection.id);
  const liked = useCuratedLikedStatus(collection.id);
  const counts = useCuratedCounts();
  const likeCount = counts[collection.id]?.likes ?? 0;

  const onSave = () => {
    if (!user) return signInRequiredToast(navigate, "/collections");
    void store.toggleCuratedSave(collection.id)
      .then(() => toast.success(saved ? "Removed from your shelf" : "Saved to your shelf"))
      .catch((err: any) => toast.error(err.message ?? "Could not save collection"));
  };

  const onLike = () => {
    if (!user) return signInRequiredToast(navigate, "/collections");
    void store.toggleCuratedLike(collection.id)
      .catch((err: any) => toast.error(err.message ?? "Could not update like"));
  };

  return (
    <article className="hso-elevated-surface hso-surface-grid flex h-full flex-col overflow-hidden rounded-[1.5rem] transition-transform hover:-translate-y-1">
      <Link to={`/collections/${collection.id}`} className="block h-28" aria-label={`Open ${collection.title}`} style={{ background: collection.cover_gradient }} />
      <div className="flex flex-1 flex-col p-5">
        <Link to={`/collections/${collection.id}`} className="font-display text-2xl font-semibold leading-tight text-ink hover:text-coral">
          {collection.title}
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{collection.description}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {[...collection.intended_majors, ...collection.categories].slice(0, 5).map((tag) => (
            <span key={tag} className="rounded-full bg-coral/10 px-2.5 py-1 text-[11px] font-bold text-coral">{tag}</span>
          ))}
        </div>
        <div className="mt-auto pt-5 flex items-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground">{collection.opportunityIds.length} opportunities</span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
            <Heart className={`h-3.5 w-3.5 ${liked ? "fill-coral text-coral" : ""}`} /> {likeCount}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Button onClick={onLike} variant="outline" size="icon" className="h-9 w-9 rounded-full" aria-label={liked ? "Unlike" : "Like"}>
              <Heart className={`h-4 w-4 ${liked ? "fill-coral text-coral" : ""}`} />
            </Button>
            <Button onClick={onSave} variant="outline" size="icon" className="h-9 w-9 rounded-full" aria-label={saved ? "Remove from shelf" : "Save to shelf"}>
              {saved ? <BookmarkCheck className="h-4 w-4 text-coral" /> : <Bookmark className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}