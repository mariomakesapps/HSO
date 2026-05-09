import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bookmark, LogOut, Menu } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store/collections";
import { CollectionsPanel } from "@/components/CollectionsPanel";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

export function SiteHeader() {
  const [session, setSession] = useState<Session | null>(null);
  const [showShelf, setShowShelf] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const scrolled = useScrolled();
  const s = useStore();
  const totalSaved = s.favorites.length + s.collections.reduce((n, c) => n + c.opportunityIds.length, 0);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => setSession(sess));
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    return () => sub.subscription.unsubscribe();
  }, []);

  const onSignOut = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    navigate("/");
  };

  const close = () => setMenuOpen(false);

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-[100] w-full border-b border-border/60 bg-background/85 backdrop-blur-md transition-[box-shadow] duration-200 ${
          scrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="mx-auto grid h-[60px] max-w-7xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 px-4 sm:px-6 md:h-[72px]">
          <Link to="/" aria-label="HSO — High School Opportunity" className="flex min-w-0 shrink-0 items-center justify-self-start font-display text-2xl font-bold leading-none tracking-tight sm:text-3xl">
            <span className="text-ink">H</span><span className="text-coral">S</span><span className="text-sage">O</span>
          </Link>

          <nav className="hidden items-center gap-6 justify-self-center text-sm font-medium text-foreground/75 md:flex">
            <Link to="/about" className="hover:text-coral">About</Link>
            <Link to="/submit" className="hover:text-coral">Submit</Link>
            <Link to="/contact" className="hover:text-coral">Contact</Link>
          </nav>

          <div className="flex shrink-0 items-center justify-self-end gap-1 sm:gap-2">
            <Button onClick={() => setShowShelf(true)} variant="ghost" size="sm" className="relative hidden rounded-lg md:inline-flex">
              <Bookmark className="mr-1.5 h-4 w-4" /> My Shelf
              {totalSaved > 0 && <span className="ml-1.5 rounded-md bg-coral/15 px-1.5 py-0.5 text-[10px] font-semibold text-coral">{totalSaved}</span>}
            </Button>
            <Button onClick={() => setShowShelf(true)} variant="ghost" size="icon" aria-label="My Shelf" className="relative rounded-lg md:hidden">
              <Bookmark className="h-4 w-4" />
              {totalSaved > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-coral px-1.5 py-0.5 text-[10px] font-semibold text-coral-foreground">{totalSaved}</span>}
            </Button>

            {session ? (
              <Button onClick={onSignOut} variant="ghost" size="icon" aria-label="Sign out" className="hidden rounded-lg md:inline-flex">
                <LogOut className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={() => navigate("/auth")} size="sm" className="hidden rounded-lg bg-ink text-cream hover:bg-ink/90 md:inline-flex">
                Sign in
              </Button>
            )}

            {/* Mobile menu */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu" className="rounded-lg md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="top-[60px] border-b border-border/60 bg-cream/95 p-6 backdrop-blur-md md:top-[72px]">
                <SheetHeader className="text-left">
                  <SheetTitle className="font-display text-xl font-medium text-ink">Menu</SheetTitle>
                </SheetHeader>
                <nav className="mt-4 grid gap-1 text-base font-medium text-ink">
                  <Link to="/about" onClick={close} className="rounded-xl px-3 py-3 hover:bg-coral/10 hover:text-coral">About</Link>
                  <Link to="/submit" onClick={close} className="rounded-xl px-3 py-3 hover:bg-coral/10 hover:text-coral">Submit</Link>
                  <Link to="/contact" onClick={close} className="rounded-xl px-3 py-3 hover:bg-coral/10 hover:text-coral">Contact</Link>
                  <button
                    onClick={() => { close(); setShowShelf(true); }}
                    className="flex items-center justify-between rounded-xl px-3 py-3 text-left hover:bg-coral/10 hover:text-coral"
                  >
                    <span className="inline-flex items-center gap-2"><Bookmark className="h-4 w-4" /> My Shelf</span>
                    {totalSaved > 0 && <span className="rounded-md bg-coral/15 px-2 py-0.5 text-xs font-semibold text-coral">{totalSaved}</span>}
                  </button>
                </nav>
                <div className="mt-4 border-t border-border/60 pt-4">
                  {session ? (
                    <Button onClick={onSignOut} variant="outline" className="w-full rounded-xl">
                      <LogOut className="mr-2 h-4 w-4" /> Sign out
                    </Button>
                  ) : (
                    <Button onClick={() => { close(); navigate("/auth"); }} className="w-full rounded-xl bg-ink text-cream hover:bg-ink/90">
                      Sign in
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      {showShelf && <CollectionsPanel onClose={() => setShowShelf(false)} />}
    </>
  );
}
