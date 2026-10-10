import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, BookmarkCheck, Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/SiteFooter";
import { FilterDropdown, type DropdownOption } from "@/components/FilterDropdown";
import { SEO } from "@/components/SEO";
import { STATIC_PAGE_META } from "@/lib/pageMeta";
import { useAuthSession } from "@/hooks/useAuthSession";
import {
  careerPaths,
  curatedCollections,
  curatedSections,
  intendedMajors,
  type CuratedCollection,
} from "@/data/curatedCollections";
import { allOpportunities, locationState } from "@/data/opportunities";
import { displayedLikes } from "@/lib/curatedBaseline";
import { allCollectionCategories, allCollectionStates, collectionFacts } from "@/lib/collectionFacts";
import { useAtmosphere } from "@/lib/atmosphere";
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

const toOptions = (values: string[]): DropdownOption[] => [
  { value: "All", label: "All" },
  ...values.map((v) => ({ value: v, label: v })),
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

  useEffect(() => {
    void loadCuratedCounts();
  }, []);

  useAtmosphere("collections");

  const counts = useCuratedCounts();

  const [major, setMajor] = useState<string>("All");
  const [career, setCareer] = useState<string>("All");
  const [type, setType] = useState<string>("All");
  const [location, setLocation] = useState<string>("All");
  const [freeOnly, setFreeOnly] = useState<boolean>(false);
  const [sort, setSort] = useState<SortKey>("featured");

  const filtered = useMemo<CuratedCollection[]>(() => {
    const base = curatedCollections.filter((c) => {
      if (c.is_active === false) return false;
      if (major !== "All" && !c.intended_majors.includes(major)) return false;
      if (career !== "All" && c.career_path !== career) return false;
      if (type !== "All" && !collectionFacts(c.id).categories.includes(type)) return false;
      if (location !== "All" && !collectionFacts(c.id).states.has(location)) return false;
      if (freeOnly && !collectionFacts(c.id).hasFree) return false;
      return true;
    });
    if (sort === "most-liked") {
      return base.slice().sort(
        (a, b) => displayedLikes(b.id, counts[b.id]?.likes) - displayedLikes(a.id, counts[a.id]?.likes),
      );
    }
    if (sort === "most-saved") {
      return base.slice().sort((a, b) => (counts[b.id]?.saves ?? 0) - (counts[a.id]?.saves ?? 0));
    }
    return base;
  }, [major, career, type, location, freeOnly, sort, counts]);

  const filtersActive =
    major !== "All" || career !== "All" || type !== "All" ||
    location !== "All" || freeOnly || sort !== "featured";

  const resetFilters = () => {
    setMajor("All"); setCareer("All"); setType("All");
    setLocation("All"); setFreeOnly(false); setSort("featured");
  };

  return (
    <div className="min-h-screen text-foreground">
      <SEO {...STATIC_PAGE_META["/collections"]} />
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

        <div className="mt-8 rounded-[1.5rem] border border-border/70 bg-cream/80 px-3 py-3 shadow-soft backdrop-blur-sm sm:px-4 sm:py-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <FilterDropdown
              label="Major"
              value={major}
              onChange={setMajor}
              options={toOptions(intendedMajors)}
              searchable
              searchPlaceholder="Search majors"
              className="w-full sm:w-auto"
              fullWidth
            />
            <FilterDropdown
              label="Career"
              value={career}
              onChange={setCareer}
              options={toOptions(careerPaths)}
              className="w-full sm:w-auto"
              fullWidth
            />
            <FilterDropdown
              label="Type"
              value={type}
              onChange={setType}
              options={toOptions(allCollectionCategories)}
              className="w-full sm:w-auto"
              fullWidth
            />
            <FilterDropdown
              label="Location"
              value={location}
              onChange={setLocation}
              options={toOptions(allCollectionStates)}
              searchable
              searchPlaceholder="Search states"
              className="w-full sm:w-auto"
              fullWidth
            />
            <FilterDropdown
              label="Sort"
              value={sort}
              onChange={(v) => setSort(v as SortKey)}
              options={SORTS.map((s) => ({ value: s.key, label: s.label }))}
              className="w-full sm:w-auto"
              fullWidth
              align="end"
            />
            <button
              type="button"
              onClick={() => setFreeOnly((v) => !v)}
              aria-pressed={freeOnly}
              className={
                "inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/40 sm:h-10 sm:w-auto " +
                (freeOnly
                  ? "border-coral/60 bg-coral/10 text-coral"
                  : "border-border/80 bg-card/90 text-ink hover:border-ink/30")
              }
            >
              <span className={"inline-block h-2 w-2 rounded-full " + (freeOnly ? "bg-coral" : "bg-muted-foreground/40")} />
              Free only
            </button>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span>{filtered.length} {filtered.length === 1 ? "collection" : "collections"}</span>
            {filtersActive && (
              <button type="button" onClick={resetFilters} className="font-semibold text-coral hover:underline">
                Reset filters
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

function CuratedCard({ collection }: { collection: CuratedCollection }) {
  const { user } = useAuthSession();
  const navigate = useNavigate();
  const saved = useCuratedSavedStatus(collection.id);
  const liked = useCuratedLikedStatus(collection.id);
  const counts = useCuratedCounts();
  const likeCount = displayedLikes(collection.id, counts[collection.id]?.likes);

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

  // Everything shown below is derived from the listings the collection really
  // contains, so a card can never advertise a category it does not hold or a
  // count that includes references which no longer resolve.
  const facts = collectionFacts(collection.id);

  return (
    <article className="hso-elevated-surface hso-surface-grid hso-press flex h-full flex-col overflow-hidden rounded-[1.5rem] transition-[transform,box-shadow] duration-300 hover:-translate-y-1">
      <Link
        to={`/collections/${collection.id}`}
        className="relative block h-24 overflow-hidden"
        aria-label={`Open ${collection.title}`}
        style={{ background: collection.cover_gradient }}
      >
        <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,hsl(var(--ink)/0.28))]" />
        <span className="absolute bottom-2 left-4 text-[11px] font-bold uppercase tracking-[0.18em] text-cream/90">
          {facts.opportunities.length} {facts.opportunities.length === 1 ? "program" : "programs"}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <Link to={`/collections/${collection.id}`} className="font-display text-2xl font-semibold leading-tight text-ink hover:text-coral">
          {collection.title}
        </Link>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{collection.description}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {[...collection.intended_majors, ...facts.categories].slice(0, 5).map((tag) => (
            <span key={tag} className="rounded-full bg-coral/10 px-2.5 py-1 text-[11px] font-bold text-coral">{tag}</span>
          ))}
        </div>

        {/* A glance at what is actually inside beats a bare count. */}
        {facts.highlights.length > 0 && (
          <ul className="mt-4 space-y-1 border-t border-border/60 pt-3 text-xs text-muted-foreground">
            {facts.highlights.map((o) => (
              <li key={o.id} className="flex items-start gap-1.5">
                <span aria-hidden="true" className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-coral/70" />
                <span className="truncate">{o.title}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto pt-5 flex items-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground">
            {facts.hasFree ? "Free options inside" : `${facts.opportunities.length} opportunities`}
          </span>
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