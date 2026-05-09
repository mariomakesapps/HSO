import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { useStore } from "@/store/collections";
import { Bookmark, FolderHeart, LogOut, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function Profile() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const s = useStore();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
      setSession(sess);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !session) navigate("/auth");
  }, [loading, session, navigate]);

  const onSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate("/");
  };

  if (loading || !session) return null;

  const email = session.user.email ?? "";
  const initial = (email[0] || "?").toUpperCase();
  const totalCollections = s.collections.length;
  const totalFavorites = s.favorites.length;

  return (
    <>
      <SiteHeader />
      <main className="relative mx-auto max-w-3xl px-4 pb-24 pt-8 md:px-6 md:pt-12">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-coral">
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>

        <div className="mt-6 rounded-[22px] border border-border/60 bg-card/80 p-6 shadow-editorial backdrop-blur-md sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-coral to-ochre text-2xl font-bold text-cream shadow-soft">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Your account</p>
              <h1 className="font-display text-3xl leading-tight">
                <span className="text-ink">H</span><span className="text-coral">S</span><span className="text-sage">O</span> profile
              </h1>
              <p className="mt-1 truncate text-sm text-muted-foreground">{email}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-cream/60 p-5">
              <Bookmark className="h-5 w-5 text-coral" />
              <p className="mt-3 font-display text-3xl leading-none">{totalFavorites}</p>
              <p className="mt-1 text-sm text-muted-foreground">Saved opportunities</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-cream/60 p-5">
              <FolderHeart className="h-5 w-5 text-sage" />
              <p className="mt-3 font-display text-3xl leading-none">{totalCollections}</p>
              <p className="mt-1 text-sm text-muted-foreground">Collections</p>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2 border-t border-border/60 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Browsing programs is free — your account just keeps your shelf safe.
            </p>
            <Button onClick={onSignOut} variant="outline" className="rounded-xl">
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}