import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, LogOut } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/collections";
import { CollectionsPanel } from "@/components/CollectionsPanel";

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
    navigate("/auth");
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
          <Link to="/" aria-label="HSO — High School Opportunity" className="group flex items-center font-display text-2xl font-bold tracking-tight leading-none">
            <span className="text-ink">H</span>
            <span className="hso-reveal">
              <span className="hso-reveal-inner text-ink">igh&nbsp;</span>
            </span>
            <span className="text-coral">S</span>
            <span className="hso-reveal">
              <span className="hso-reveal-inner text-ink">chool&nbsp;</span>
            </span>
            <span className="text-sage">O</span>
            <span className="hso-reveal">
              <span className="hso-reveal-inner text-ink">pportunity</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-foreground/75 md:flex">
            <Link to="/" className="hover:text-coral">Discover</Link>
            <Link to="/about" className="hover:text-coral">About</Link>
            <Link to="/submit" className="hover:text-coral">Submit</Link>
            <Link to="/contact" className="hover:text-coral">Contact</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowShelf(true)} variant="ghost" size="sm" className="relative hidden rounded-lg sm:inline-flex">
              <Bookmark className="mr-1.5 h-4 w-4" /> My Shelf
              {totalSaved > 0 && <span className="ml-1.5 rounded-md bg-coral/15 px-1.5 py-0.5 text-[10px] font-semibold text-coral">{totalSaved}</span>}
            </Button>
            <Button onClick={() => setShowShelf(true)} variant="ghost" size="icon" aria-label="My Shelf" className="relative rounded-lg sm:hidden">
              <Bookmark className="h-4 w-4" />
              {totalSaved > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-coral px-1.5 py-0.5 text-[10px] font-semibold text-coral-foreground">{totalSaved}</span>}
            </Button>
            {session ? (
              <Button onClick={onSignOut} variant="ghost" size="icon" aria-label="Sign out" className="rounded-lg">
                <LogOut className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={() => navigate("/auth")} size="sm" className="rounded-lg bg-ink text-cream hover:bg-ink/90">Sign in</Button>
            )}
          </div>
        </div>
      </header>
      {showShelf && <CollectionsPanel onClose={() => setShowShelf(false)} />}
    </>
  );
}