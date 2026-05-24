import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, Lock } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { OpportunityCard } from "@/components/OpportunityCard";
import { allOpportunities } from "@/data/opportunities";
import { sampleCollections } from "@/data/sampleCollections";
import { supabase } from "@/integrations/supabase/client";
import { useSEO } from "@/lib/seo";

const db = supabase as any;

type SharedCollectionRow = {
  id: string;
  owner_id: string;
  title: string;
  description: string;
  cover_image: string | null;
  cover_gradient: string;
  tags: string[];
  intended_majors: string[];
  categories: string[];
  updated_at: string;
  owner_username?: string;
};

const SharedCollection = () => {
  const { id, token } = useParams<{ id?: string; token?: string }>();
  const navigate = useNavigate();
  const goBack = () => {
    // If the user landed here from another HSO page, walk back so the
    // previous Collections tab + scroll position are restored.
    if (window.history.length > 1 && document.referrer.includes(window.location.host)) {
      navigate(-1);
    } else {
      navigate("/collections");
    }
  };
  const [collection, setCollection] = useState<SharedCollectionRow | null>(null);
  const [opportunityIds, setOpportunityIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useSEO({
    title: collection ? `${collection.title} - HSO Collection` : "Shared collection - HSO",
    description: collection?.description || "Open an HSO opportunity collection.",
  });

  useEffect(() => {
    let active = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        if (token) {
          const [{ data: collectionData, error: collectionError }, { data: itemsData, error: itemsError }] = await Promise.all([
            db.rpc("get_collection_by_share_token", { p_share_token: token }),
            db.rpc("get_collection_items_by_share_token", { p_share_token: token }),
          ]);
          if (collectionError) throw collectionError;
          if (itemsError) throw itemsError;
          const row = collectionData?.[0];
          if (!row) throw new Error("This share link is invalid or expired.");
          if (!active) return;
          setCollection(row);
          setOpportunityIds((itemsData ?? []).map((item: any) => item.opportunity_id));
          return;
        }

        if (!id) throw new Error("Collection not found.");
        const sample = sampleCollections.find((collection) => collection.id === id);
        if (sample) {
          if (!active) return;
          setCollection({
            id: sample.id,
            owner_id: sample.owner_id,
            title: sample.title,
            description: sample.description,
            cover_image: sample.cover_image,
            cover_gradient: sample.cover_gradient,
            tags: sample.tags,
            intended_majors: sample.intended_majors,
            categories: sample.categories,
            updated_at: new Date(sample.updatedAt).toISOString(),
            owner_username: sample.owner_username ?? "HSO student",
          });
          setOpportunityIds(sample.opportunityIds);
          return;
        }

        const { data: collectionData, error: collectionError } = await db.from("collections").select("*").eq("id", id).single();
        if (collectionError) throw collectionError;

        const [{ data: ownerRows }, { data: itemsData, error: itemsError }] = await Promise.all([
          db.from("users").select("id, username").eq("id", collectionData.owner_id),
          db.from("collection_items").select("*").eq("collection_id", id).order("position", { ascending: true }),
        ]);
        if (itemsError) throw itemsError;
        if (!active) return;
        setCollection({ ...collectionData, owner_username: ownerRows?.[0]?.username ?? "HSO student" });
        setOpportunityIds((itemsData ?? []).map((item: any) => item.opportunity_id));
      } catch (err: any) {
        if (active) setError(err.message ?? "Could not open collection.");
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [id, token]);

  const opportunities = useMemo(
    () => opportunityIds.map((opportunityId) => allOpportunities.find((opportunity) => opportunity.id === opportunityId)).filter(Boolean),
    [opportunityIds],
  );

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-16">
        <div className="hso-glass-panel rounded-[1.5rem] p-8 text-center">Opening collection...</div>
      </main>
    );
  }

  if (error || !collection) {
    return (
      <div className="min-h-screen">
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <div className="hso-glass-panel rounded-[1.5rem] p-8">
            <Lock className="mx-auto h-8 w-8 text-coral" />
            <h1 className="mt-3 font-display text-3xl font-semibold text-ink">Collection unavailable</h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{error || "This collection is private or no longer exists."}</p>
            <Link to="/collections" className="mt-5 inline-flex rounded-full bg-ink px-5 py-3 text-sm font-bold text-cream hover:bg-coral">
              Explore collections
            </Link>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground">
      <main className="mx-auto w-full max-w-[1180px] px-4 pb-24 pt-8 md:px-6 md:pt-12">
        <button
          type="button"
          onClick={goBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-coral"
        >
          <ArrowLeft className="h-4 w-4" /> Collections
        </button>

        <section className="hso-glass-panel hso-surface-grid mt-5 overflow-hidden rounded-[2rem]">
          <div
            className="h-44 bg-cover bg-center"
            style={
              collection.cover_image
                ? { backgroundImage: `linear-gradient(135deg, rgba(16,24,39,0.25), rgba(255,118,92,0.2)), url(${collection.cover_image})` }
                : { background: collection.cover_gradient }
            }
          />
          <div className="p-6 sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
              @{collection.owner_username ?? "HSO student"} - Updated {new Date(collection.updated_at).toLocaleDateString()}
            </p>
            <h1 className="mt-2 max-w-4xl font-display text-4xl font-semibold tracking-tight text-ink sm:text-6xl">{collection.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {collection.description || "A shared HSO opportunity collection."}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {[...(collection.tags ?? []), ...(collection.intended_majors ?? []), ...(collection.categories ?? [])].map((tag) => (
                <span key={tag} className="rounded-full border border-white/65 bg-cream/70 px-3 py-1 text-xs font-bold text-ink">{tag}</span>
              ))}
            </div>
            <Button
              onClick={() => navigator.clipboard.writeText(window.location.href)}
              className="mt-6 rounded-full bg-ink text-cream hover:bg-coral"
            >
              Copy link <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sage">Saved programs</p>
              <h2 className="font-display text-3xl font-semibold text-ink">{opportunities.length} opportunities</h2>
            </div>
          </div>
          {opportunities.length ? (
            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {opportunities.map((opportunity: any, index) => (
                <OpportunityCard key={opportunity.id} opp={opportunity} index={index} />
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-[1.5rem] border border-dashed border-border bg-card/60 p-8 text-center text-sm text-muted-foreground">
              No active opportunities are saved in this collection yet.
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default SharedCollection;
