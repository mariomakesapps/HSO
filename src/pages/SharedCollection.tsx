import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { SiteFooter } from "@/components/SiteFooter";
import { useSEO } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";
import { allOpportunities } from "@/data/opportunities";
import { OpportunityCard } from "@/components/OpportunityCard";

type Shared = { name: string; emoji: string; opportunity_ids: string[]; created_at: string };

const SharedCollection = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<Shared | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useSEO({
    title: data ? `${data.emoji} ${data.name} — shared on HSO` : "Collection — HSO",
    description: data ? `A curated collection of ${data.opportunity_ids.length} high school opportunities.` : undefined,
  });

  useEffect(() => {
    if (!id) return;
    supabase.from("shared_collections")
      .select("name, emoji, opportunity_ids, created_at")
      .eq("slug", id).maybeSingle()
      .then(({ data, error }) => {
        setLoading(false);
        if (error || !data) { setNotFound(true); return; }
        setData(data as Shared);
      });
  }, [id]);

  return (
    <div className="min-h-screen bg-background bg-grain">
      <main className="mx-auto max-w-5xl px-4 py-14 sm:px-6 sm:py-16">
        {loading && <p className="text-muted-foreground">Loading…</p>}
        {notFound && (
          <div className="text-center">
            <h1 className="font-display text-4xl">Collection not found</h1>
            <Link to="/" className="mt-6 inline-block text-coral underline">Back to discover</Link>
          </div>
        )}
        {data && (
          <>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Shared collection</p>
            <h1 className="mt-2 font-display text-4xl font-semibold sm:text-6xl">
              <span className="mr-3">{data.emoji}</span>{data.name}
            </h1>
            <p className="mt-2 text-muted-foreground">{data.opportunity_ids.length} opportunities</p>
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {data.opportunity_ids
                .map((oid) => allOpportunities.find((o) => o.id === oid))
                .filter((o): o is NonNullable<typeof o> => !!o)
                .map((o, i) => <OpportunityCard key={o.id} opp={o} index={i} />)}
            </div>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
};
export default SharedCollection;