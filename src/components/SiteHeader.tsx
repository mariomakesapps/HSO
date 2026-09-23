import { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bookmark, LogOut, Menu, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useShelfCount } from "@/store/collections";
import { authRedirectHref, localSignOut, useAuthSession } from "@/hooks/useAuthSession";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

/**
 * The shelf panel is code-split, but the chunk used to start downloading only
 * on the first click — so that click did nothing for a round trip and the
 * panel then appeared with no transition. Prefetching on idle (and again on
 * hover) means the module is already in memory when the button is pressed.
 */
const importCollectionsPanel = () => import("@/components/CollectionsPanel");
const CollectionsPanel = lazy(() =>
  importCollectionsPanel().then((module) => ({ default: module.CollectionsPanel })),
);

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

const NAV_ITEMS = [
  { to: "/deadlines", label: "Deadlines" },
  { to: "/about", label: "About" },
  { to: "/submit", label: "Submit" },
  { to: "/volunteer", label: "HSO Internships" },
  { to: "/collections", label: "Collections" },
  { to: "/contact", label: "Contact" },
];

/**
 * Desktop nav with an active pill that slides between tabs.
 *
 * Previously each link toggled its own background, so the active state cut
 * instantly from one tab to the next. A single shared indicator measured
 * against the active link travels between them instead, which is what makes
 * a tab bar feel continuous rather than switched.
 */
function DesktopNav({ pathname }: { pathname: string }) {
  const navRef = useRef<HTMLElement>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const measure = () => {
      // Below the md breakpoint the nav is display:none, so every offset reads
      // 0. Measuring then would park a zero-width pill at the left edge, which
      // would animate out from there on the first desktop render.
      if (!nav.offsetWidth) return;

      const active = nav.querySelector<HTMLElement>('[data-active="true"]');
      if (!active) {
        setPill(null);
        return;
      }
      setPill({ left: active.offsetLeft, width: active.offsetWidth });
    };

    measure();
    // Fonts landing late change link widths, which would leave the pill
    // measured against stale geometry.
    const ro = new ResizeObserver(measure);
    ro.observe(nav);
    void document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [pathname]);

  return (
    <nav
      ref={navRef}
      className="relative hidden items-center justify-center gap-1 rounded-full border border-white/65 bg-card/45 px-1.5 py-1 text-sm font-bold text-foreground/75 shadow-[inset_0_1px_0_hsl(0_0%_100%/0.65)] md:flex"
    >
      {pill && (
        <span
          aria-hidden="true"
          className="hso-nav-indicator"
          style={{
            transform: `translateX(${pill.left}px)`,
            width: pill.width,
            top: 4,
            bottom: 4,
            left: 0,
          }}
        />
      )}
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            data-active={active}
            className={cn(
              "relative z-10 rounded-full px-3 py-1.5 transition-colors duration-300",
              active ? "text-cream" : "hover:text-coral",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function SiteHeader() {
  const { session } = useAuthSession();
  const [showShelf, setShowShelf] = useState(false);
  const [shelfPanelLoaded, setShelfPanelLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const scrolled = useScrolled();
  const totalSaved = useShelfCount();

  useEffect(() => {
    if (showShelf) setShelfPanelLoaded(true);
  }, [showShelf]);

  // Fetch the shelf chunk during idle time so the first open is instant.
  useEffect(() => {
    const warm = () => void importCollectionsPanel();
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(warm, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const t = setTimeout(warm, 1200);
    return () => clearTimeout(t);
  }, []);

  const onSignOut = async () => {
    try {
      await localSignOut();
      setMenuOpen(false);
      toast.success("Signed out");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message ?? "Could not sign out");
    }
  };

  const close = () => setMenuOpen(false);
  const goAuth = () => {
    const returnTo = location.pathname + location.search;
    if (returnTo.startsWith("/auth")) {
      navigate("/auth");
      return;
    }
    // authRedirectHref saves the current scroll position so ScrollToTop can
    // restore it after the user finishes signing in.
    navigate(authRedirectHref(returnTo));
  };

  const userEmail = session?.user.email ?? "";
  const userInitial = (userEmail[0] || "?").toUpperCase();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[100] w-full px-2 pt-2 transition-transform duration-300">
        <div
          className={cn(
            "hso-nav-shell mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-2 overflow-visible rounded-2xl px-4 md:grid md:h-auto md:grid-cols-[1fr_auto_1fr] md:rounded-[1.35rem] md:px-4 md:py-2.5",
            scrolled && "shadow-[inset_0_1px_0_hsl(0_0%_100%/0.76),0_18px_56px_-36px_hsl(var(--ink)/0.58)]",
          )}
        >
          <Link
            to="/"
            aria-label="HSO - High School Opportunity"
            onClick={(e) => {
              // If already on the homepage, prevent navigation noise and just
              // scroll smoothly to the top. Otherwise let the router navigate
              // normally — ScrollToTop will reset position.
              if (location.pathname === "/") {
                e.preventDefault();
                const prefersReduced = window.matchMedia(
                  "(prefers-reduced-motion: reduce)",
                ).matches;
                window.scrollTo({
                  top: 0,
                  left: 0,
                  behavior: prefersReduced ? "auto" : "smooth",
                });
              }
            }}
            className="group flex shrink-0 items-center overflow-visible py-1 font-display text-xl font-black leading-[1.15] tracking-tight sm:text-2xl"
          >
            <span className="text-ink">H</span>
            <span className="hso-reveal hidden md:inline"><span className="hso-reveal-inner text-ink">igh&nbsp;</span></span>
            <span className="text-coral">S</span>
            <span className="hso-reveal hidden md:inline"><span className="hso-reveal-inner text-ink">chool&nbsp;</span></span>
            <span className="text-sage">O</span>
            <span className="hso-reveal hidden md:inline"><span className="hso-reveal-inner text-ink">pportunity</span></span>
          </Link>

          <DesktopNav pathname={location.pathname} />

          <div className="flex shrink-0 items-center justify-end gap-1 md:gap-2">
            <Button onClick={() => setShowShelf((open) => !open)} onPointerEnter={() => void importCollectionsPanel()} onFocus={() => void importCollectionsPanel()} variant="ghost" size="sm" className="group relative hidden rounded-full font-bold md:inline-flex" aria-expanded={showShelf}>
              <Bookmark className="mr-1.5 h-4 w-4" /> My Shelf
              {totalSaved > 0 && (
                <span className="ml-1.5 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-coral px-1.5 text-[10px] font-bold leading-none text-coral-foreground ring-1 ring-coral/20 transition-colors group-hover:bg-cream group-hover:text-coral group-hover:ring-coral/45">
                  {totalSaved}
                </span>
              )}
            </Button>
            <Button onClick={() => setShowShelf((open) => !open)} onPointerEnter={() => void importCollectionsPanel()} onFocus={() => void importCollectionsPanel()} variant="ghost" size="icon" aria-label="My Shelf" aria-expanded={showShelf} className="group relative h-9 w-9 rounded-full md:hidden">
              <Bookmark className="h-[18px] w-[18px]" />
              {totalSaved > 0 && (
                <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold leading-none text-coral-foreground ring-1 ring-cream">
                  {totalSaved}
                </span>
              )}
            </Button>

            {session && (
              <button
                onClick={() => navigate("/profile")}
                aria-label="Profile"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink text-xs font-bold text-cream shadow-soft transition-transform hover:-translate-y-0.5 hover:bg-coral md:hidden"
              >
                {userInitial}
              </button>
            )}

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    aria-label="Open profile menu"
                    className="hidden h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-bold text-cream shadow-soft outline-none ring-coral/40 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-coral focus-visible:ring-2 md:inline-flex"
                  >
                    {userInitial}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={8}
                  className="w-56 rounded-2xl border-border/60 bg-cream/95 p-1.5 shadow-editorial backdrop-blur-md"
                >
                  <DropdownMenuLabel className="px-2 py-2">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Signed in</p>
                    <p className="mt-0.5 truncate text-sm font-medium text-ink">{userEmail}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/60" />
                  <DropdownMenuItem
                    onSelect={() => navigate("/profile")}
                    className="cursor-pointer rounded-xl px-2 py-2 focus:bg-coral/10 focus:text-coral"
                  >
                    <UserIcon className="mr-2 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={(e) => { e.preventDefault(); setShowShelf(true); }}
                    className="cursor-pointer rounded-xl px-2 py-2 focus:bg-coral/10 focus:text-coral"
                  >
                    <Bookmark className="mr-2 h-4 w-4" /> My Shelf
                    {totalSaved > 0 && (
                      <span className="ml-auto inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-coral px-1.5 text-[10px] font-bold leading-none text-coral-foreground">
                        {totalSaved}
                      </span>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/60" />
                  <DropdownMenuItem
                    onSelect={onSignOut}
                    className="cursor-pointer rounded-xl px-2 py-2 text-coral focus:bg-coral/10 focus:text-coral"
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={goAuth} size="sm" className="hidden rounded-full bg-ink px-5 font-bold text-cream shadow-[0_14px_28px_-22px_hsl(var(--ink)/0.8)] transition-transform hover:-translate-y-0.5 hover:bg-coral active:scale-[0.98] active:translate-y-0 md:inline-flex">
                Sign in
              </Button>
            )}

            {/* Mobile menu */}
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu" className="h-9 w-9 rounded-full md:hidden">
                  <Menu className="h-[18px] w-[18px]" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="border-b border-border/60 bg-cream/95 backdrop-blur-md p-6">
                <SheetHeader className="text-left">
                  <SheetTitle className="font-display text-xl font-medium text-ink">Menu</SheetTitle>
                </SheetHeader>
                <nav className="mt-4 grid gap-1 text-base font-medium text-ink">
                  <Link to="/deadlines" onClick={close} className="rounded-xl px-3 py-3 hover:bg-coral/10 hover:text-coral">Deadlines</Link>
                  <Link to="/about" onClick={close} className="rounded-xl px-3 py-3 hover:bg-coral/10 hover:text-coral">About</Link>
                  <Link to="/submit" onClick={close} className="rounded-xl px-3 py-3 hover:bg-coral/10 hover:text-coral">Submit</Link>
                  <Link to="/volunteer" onClick={close} className="rounded-xl px-3 py-3 hover:bg-coral/10 hover:text-coral">HSO Internships</Link>
                  <Link to="/collections" onClick={close} className="rounded-xl px-3 py-3 hover:bg-coral/10 hover:text-coral">Collections</Link>
                  <Link to="/contact" onClick={close} className="rounded-xl px-3 py-3 hover:bg-coral/10 hover:text-coral">Contact</Link>
                  <button
                    onClick={() => { close(); setShowShelf(true); }}
                    className="flex items-center justify-between rounded-xl px-3 py-3 text-left hover:bg-coral/10 hover:text-coral"
                  >
                    <span className="inline-flex items-center gap-2"><Bookmark className="h-4 w-4" /> My Shelf</span>
                    {totalSaved > 0 && (
                      <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-coral px-1.5 text-xs font-bold leading-none text-coral-foreground">
                        {totalSaved}
                      </span>
                    )}
                  </button>
                </nav>
                <div className="mt-4 border-t border-border/60 pt-4">
                  {session ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 rounded-xl bg-cream/60 px-3 py-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-coral to-ochre text-sm font-bold text-cream">
                          {userInitial}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Signed in</p>
                          <p className="truncate text-sm font-medium text-ink">{userEmail}</p>
                        </div>
                      </div>
                      <Link to="/profile" onClick={close} className="flex items-center gap-2 rounded-xl px-3 py-3 text-base font-medium text-ink hover:bg-coral/10 hover:text-coral">
                        <UserIcon className="h-4 w-4" /> Profile
                      </Link>
                      <button onClick={onSignOut} className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-base font-medium text-coral hover:bg-coral/10">
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </div>
                  ) : (
                    <Button onClick={() => { close(); goAuth(); }} className="w-full rounded-xl bg-ink text-cream hover:bg-ink/90">
                      Sign in
                    </Button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      {/* Spacer to offset fixed header height */}
      <div aria-hidden="true" className="h-[72px] md:h-[76px]" />
      {shelfPanelLoaded && (
        <Suspense fallback={null}>
          <CollectionsPanel open={showShelf} onOpenChange={setShowShelf} />
        </Suspense>
      )}
    </>
  );
}
