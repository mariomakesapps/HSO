import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Bookmark, BookmarkCheck, Heart, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/SiteFooter";
import { OpportunityCard } from "@/components/OpportunityCard";
import { allOpportunities } from "@/data/opportunities";
import { getCuratedCollection } from "@/data/curatedCollections";
import { useAuthSession } from "@/hooks/useAuthSession";
import {
  loadCuratedCounts,
  store,
  useCuratedCounts,
  useCuratedLikedStatus,
  useCuratedSavedStatus,
} from "@/store/collections";
import { useSEO } from "@/lib/seo";
import { displayedLikes } from "@/lib/curatedBaseline";

const CuratedCollectionDetail = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { user } = useAuthSession();
  const collection = id ? getCuratedCollection(id) : undefined;
  const saved = useCuratedSavedStatus(collection?.id ?? "");
  const liked = useCuratedLikedStatus(collection?.id ?? "");
  const counts = useCuratedCounts();
  const likeCount = collection ? displayedLikes(collection.id, counts[collection.id]?.likes) : 0;

  useEffect(() => { void loadCuratedCounts(); }, []);

  useSEO({
    title: collection ? `${collection.title} - HSO Collection` : "Collection - HSO",
    description: (() => {
      const raw =
        collection?.description ||
        "A curated HSO list of high school opportunities: internships, research, scholarships, competitions, and summer programs picked by editors.";
      return raw.length > 158 ? `${raw.slice(0, 155)}…` : raw;
    })(),
  });

  const allOpps = useMemo(
    () => (collection?.opportunityIds ?? []).map((oid) => allOpportunities.find((o) => o.id === oid)).filter(Boolean),
    [collection],
  );

  const [filterCat, setFilterCat] = useState<string>("All");
  const cats = useMemo(() => Array.from(new Set(allOpps.map((o: any) => o.category))), [allOpps]);
  const opportunities = useMemo(
    () => filterCat === "All" ? allOpps : allOpps.filter((o: any) => o.category === filterCat),
    [allOpps, filterCat],
  );

  const goBack = () => {
    if (window.history.length > 1 && document.referrer.includes(window.location.host)) navigate(-1);
    else navigate("/collections");
  };

  if (!collection) {
    return (
      <div className="min-h-screen">
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <div className="hso-glass-panel rounded-[1.5rem] p-8">
            <Lock className="mx-auto h-8 w-8 text-coral" />
            <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Collection unavailable</h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">This collection no longer exists.</p>
            <Link to="/collections" className="mt-5 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-bold text-cream hover:bg-coral">
              Browse curated collections
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const requireSignIn = () => {
    toast.error("Sign-in required", {
      description: "Create a free HSO account to like or save collections.",
      action: {
        label: "Sign in",
        onClick: () => navigate(`/auth?redirect=${encodeURIComponent(`/collections/${collection.id}`)}`),
      },
    });
  };

  const onSave = () => {
    if (!user) return requireSignIn();
    void store.toggleCuratedSave(collection.id)
      .then(() => toast.success(saved ? "Removed from your shelf" : "Saved to your shelf"))
      .catch((err: any) => toast.error(err.message ?? "Could not save collection"));
  };
  const onLike = () => {
    if (!user) return requireSignIn();
    void store.toggleCuratedLike(collection.id)
      .catch((err: any) => toast.error(err.message ?? "Could not update like"));
  };

  return (
    <div className="min-h-screen text-foreground">
      <main className="mx-auto w-full max-w-[1180px] px-4 pb-24 pt-8 md:px-6 md:pt-12">
        <button type="button" onClick={goBack} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-coral">
          <ArrowLeft className="h-4 w-4" /> Collections
        </button>

        <section className="hso-glass-panel hso-surface-grid mt-5 overflow-hidden rounded-[2rem]">
          <div className="h-44 bg-cover bg-center" style={{ background: collection.cover_gradient }} />
          <div className="p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sage">HSO Curated</p>
            <h1 className="mt-2 max-w-4xl font-display text-4xl font-semibold tracking-tight text-ink sm:text-6xl">{collection.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{collection.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[...collection.tags, ...collection.intended_majors, ...collection.categories].map((tag) => (
                <span key={tag} className="rounded-full border border-white/65 bg-cream/70 px-3 py-1 text-xs font-bold text-ink">{tag}</span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button onClick={onSave} className="rounded-full bg-ink text-cream hover:bg-coral">
                {saved ? <BookmarkCheck className="mr-2 h-4 w-4" /> : <Bookmark className="mr-2 h-4 w-4" />}
                {saved ? "Saved" : "Save to shelf"}
              </Button>
              <Button onClick={onLike} variant="outline" className="rounded-full">
                <Heart className={`mr-2 h-4 w-4 ${liked ? "fill-coral text-coral" : ""}`} />
                {liked ? "Liked" : "Like"} · {likeCount}
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sage">In this collection</p>
              <h2 className="font-display text-3xl font-semibold text-ink">{opportunities.length} of {allOpps.length} opportunities</h2>
            </div>
            {cats.length > 1 && (
              <select
                value={filterCat}
                onChange={(e) => setFilterCat(e.target.value)}
                className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-ink"
                aria-label="Filter by type"
              >
                <option value="All">All types</option>
                {cats.map((c) => <option key={c as string} value={c as string}>{c as string}</option>)}
              </select>
            )}
          </div>
          {opportunities.length ? (
            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {opportunities.map((opportunity: any, index) => (
                <OpportunityCard key={opportunity.id} opp={opportunity} index={index} />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-[1.5rem] border border-dashed border-border bg-card/60 p-8 text-center text-sm text-muted-foreground">
              No active opportunities are listed in this collection yet.
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default CuratedCollectionDetail;