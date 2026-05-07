import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, LogOut, Plus } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import hsoLogo from "@/assets/hso-logo.png";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/collections";
import { CollectionsPanel } from "@/components/CollectionsPanel";
import { clearIntroSeen } from "@/components/IntroSplash";

export function SiteHeader() {
  const [session, setSession] = useState<Session | null>(null);
  const [showShelf, setShowShelf] = useState(false);
  const navigate = useNavigate();
  const s = useStore();
  const totalSaved = s.favorites.length + s.collections.reduce((n, c) => n + c.opportunityIds.length, 0);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => setSession(sess));
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    return () => sub.subscription.unsubscribe();
  }, []);

  const onSignOut = async () => {
    await supabase.auth.signOut();
    clearIntroSeen();
    navigate("/auth");
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-coral/30 bg-gradient-to-r from-coral/15 via-cream/80 to-sage/20 backdrop-blur-md shadow-soft">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="relative inline-block h-10 w-10 overflow-hidden rounded-xl ring-1 ring-foreground/10 shadow-soft">
              <img src={hsoLogo} alt="HSO logo" className="absolute inset-0 h-full w-full scale-[1.35] object-cover transition-transform duration-700 hover:rotate-6 hover:scale-[1.45]" />
            </span>
            <span className="font-display text-2xl font-semibold tracking-tight">
              <span className="text-ink">H</span><span className="text-coral">S</span><span className="text-sage">O</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-5 text-sm text-foreground/80 md:flex">
            <Link to="/" className="hover:text-coral">Discover</Link>
            <Link to="/about" className="hover:text-coral">About</Link>
            <Link to="/submit" className="hover:text-coral">Submit</Link>
            <Link to="/contact" className="hover:text-coral">Contact</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className="hidden rounded-full border-foreground/20 bg-card hover:bg-coral hover:text-coral-foreground sm:inline-flex">
              <Link to="/submit"><Plus className="mr-1 h-4 w-4" /> Submit</Link>
            </Button>
            <Button onClick={() => setShowShelf(true)} variant="outline" size="icon" aria-label="My Shelf" className="relative rounded-full border-foreground/20 bg-card hover:bg-ink hover:text-cream">
              <Bookmark className="h-4 w-4" />
              {totalSaved > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-coral px-1.5 py-0.5 text-[10px] font-semibold text-coral-foreground">{totalSaved}</span>}
            </Button>
            {session ? (
              <Button onClick={onSignOut} variant="outline" size="icon" aria-label="Sign out" className="rounded-full border-foreground/20 bg-card hover:bg-ink hover:text-cream">
                <LogOut className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={() => navigate("/auth")} variant="outline" className="rounded-full border-foreground/20 bg-card hover:bg-ink hover:text-cream">Sign in</Button>
            )}
          </div>
        </div>
      </header>
      {showShelf && <CollectionsPanel onClose={() => setShowShelf(false)} />}
    </>
  );
}