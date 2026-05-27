import { useNavigate } from "react-router-dom";
import { Bookmark, BookmarkCheck, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/SiteFooter";
import { useSEO } from "@/lib/seo";
import { authRedirectHref, useAuthSession } from "@/hooks/useAuthSession";
import { curatedSections, type CuratedCollection } from "@/data/curatedCollections";
import { store, useCuratedLikedStatus, useCuratedSavedStatus } from "@/store/collections";

export default function Collections() {
  useSEO({
    title: "Curated Collections - HSO",
    description: "Hand-picked opportunity lists for different majors, careers, and goals.",
  });

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
              Hand-picked opportunity lists for different majors, careers, and goals.
            </p>
          </div>
        </section>

        <div className="mt-10 space-y-14">
          {curatedSections.map((section) => (
            <section key={section.id} aria-labelledby={`section-${section.id}`}>
              <div className="flex items-end justify-between gap-4">
                <h2 id={`section-${section.id}`} className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                  {section.title}
                </h2>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
                  {section.collections.length} {section.collections.length === 1 ? "collection" : "collections"}
                </span>
              </div>
              <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {section.collections.map((collection) => (
                  <CuratedCard key={collection.id} collection={collection} />
                ))}
              </div>
            </section>
          ))}
        </div>
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

  const requireAuth = () => {
    navigate(authRedirectHref("/collections"));
  };

  const onSave = () => {
    if (!user) return requireAuth();
    void store.toggleCuratedSave(collection.id)
      .then(() => toast.success(saved ? "Removed from your shelf" : "Saved to your shelf"))
      .catch((err: any) => toast.error(err.message ?? "Could not save collection"));
  };

  const onLike = () => {
    if (!user) return requireAuth();
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
        <div className="mt-auto pt-5 flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground">{collection.opportunityIds.length} opportunities</span>
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