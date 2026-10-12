import { Suspense, lazy, useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Bookmark, ChevronDown, LogOut, Menu, Search, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { useShelfCount } from "@/store/collections";
import { authRedirectHref, localSignOut, useAuthSession } from "@/hooks/useAuthSession";
import { CATEGORY_META, CATEGORY_SLUGS } from "@/lib/categories";
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
import { Button } from "./Button";

const importCollectionsPanel = () => import("@/components/CollectionsPanel");
const CollectionsPanel = lazy(() => importCollectionsPanel().then((m) => ({ default: m.CollectionsPanel })));

/** "Academic competitions for high school students" -> "Academic competitions". */
const shortName = (slug: (typeof CATEGORY_SLUGS)[number]) =>
  CATEGORY_META[slug].h1.replace(/\s+for high school students$/i, "").replace(/^./, (c) => c.toUpperCase());

const NAV_LINK =
  "inline-flex min-h-hso-tap items-center gap-1 rounded-hso px-3 text-sm font-medium text-hso-muted transition-colors hover:bg-hso-sunken hover:text-hso-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hso-coral-strong";

function Logo() {
  return (
    <Link
      to="/"
      aria-label="HSO, High School Opportunity, home"
      className="inline-flex min-h-hso-tap shrink-0 items-center gap-2 rounded-hso pr-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hso-coral-strong"
    >
      <span className="text-[1.375rem] font-extrabold tracking-tight text-hso-fg">
        H<span className="text-hso-coral">S</span><span className="text-hso-green">O</span>
      </span>
      <span className="hidden text-sm font-medium leading-tight text-hso-muted xl:inline">High School<br />Opportunity</span>
    </Link>
  );
}

/**
 * Search box. Submits to /?q=, the homepage's own search parameter, so a search
 * from any page lands on the filtered list (and the URL can be shared).
 */
function SearchBox({ className, onDone }: { className?: string; onDone?: () => void }) {
  const [params] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [q, setQ] = useState(location.pathname === "/" ? params.get("q") ?? "" : "");

  useEffect(() => {
    if (location.pathname === "/") setQ(params.get("q") ?? "");
  }, [location.pathname, params]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(location.pathname === "/" ? params : undefined);
    if (q.trim()) next.set("q", q.trim());
    else next.delete("q");
    next.delete("page");
    navigate({ pathname: "/", search: next.toString() ? `?${next}` : "" });
    onDone?.();
  };

  return (
    <form role="search" onSubmit={submit} className={cn("relative", className)}>
      <label htmlFor="hso-search" className="sr-only">Search opportunities</label>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-hso-subtle" aria-hidden="true" />
      <input
        id="hso-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search programs, organizations, subjects"
        enterKeyHint="search"
        className="h-11 w-full rounded-hso border border-hso-line bg-hso-sunken pl-9 pr-3 text-sm text-hso-fg placeholder:text-hso-subtle focus:border-hso-line-strong focus:bg-hso-surface focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-hso-coral-strong"
      />
    </form>
  );
}

/**
 * Sticky white top bar: logo, search, and the links students need. On phones it
 * is logo + search + menu, with everything else in a side sheet.
 */
export function TopNav() {
  const { session } = useAuthSession();
  const savedCount = useShelfCount();
  const [showShelf, setShowShelf] = useState(false);
  const [shelfLoaded, setShelfLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (showShelf) setShelfLoaded(true);
  }, [showShelf]);

  const goAuth = () => {
    const back = location.pathname + location.search;
    navigate(back.startsWith("/auth") ? "/auth" : authRedirectHref(back));
  };
  const signOut = async () => {
    try {
      await localSignOut();
      setMenuOpen(false);
      toast.success("Signed out");
      navigate("/");
    } catch (error) {
      toast.error((error as Error)?.message ?? "Could not sign out");
    }
  };
  const email = session?.user.email ?? "";

  // Soft shadow once content scrolls under the bar.
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 4);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header data-scrolled={scrolled} className="hso-ds hso-nav sticky top-0 z-50 border-b border-hso-line bg-hso-surface">
      <div className="mx-auto flex h-14 max-w-hso-page items-center gap-2 px-4 md:h-hso-nav md:gap-4">
        <Logo />
        <SearchBox className="min-w-0 flex-1 md:max-w-xl lg:mx-auto" />

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger className={NAV_LINK}>
              Categories <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 rounded-hso border-hso-line p-1 shadow-hso-overlay">
              {CATEGORY_SLUGS.map((slug) => (
                <DropdownMenuItem key={slug} asChild className="min-h-10 rounded-hso-sm text-sm">
                  <Link to={`/categories/${slug}`}>{shortName(slug)}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="min-h-10 rounded-hso-sm text-sm"><Link to="/deadlines">Deadlines closing soon</Link></DropdownMenuItem>
              <DropdownMenuItem asChild className="min-h-10 rounded-hso-sm text-sm"><Link to="/remote">Remote and nationwide</Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/collections" className={NAV_LINK}>Collections</Link>
          <Link to="/submit" className={NAV_LINK}>Submit</Link>
          <button
            type="button"
            onClick={() => setShowShelf(true)}
            onPointerEnter={() => void importCollectionsPanel()}
            className={cn(NAV_LINK, "relative")}
            aria-label={`My Shelf, ${savedCount} saved`}
          >
            <Bookmark className="h-5 w-5" aria-hidden="true" />
            <span className="hidden lg:inline">My Shelf</span>
            {savedCount > 0 && (
              <span className="rounded-hso-sm bg-hso-coral-tint px-1.5 text-xs font-semibold text-hso-coral-strong">{savedCount}</span>
            )}
          </button>
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger className={NAV_LINK} aria-label="Account">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-hso-neutral-tint text-sm font-semibold text-hso-fg">
                  {(email[0] || "?").toUpperCase()}
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 rounded-hso border-hso-line p-1 shadow-hso-overlay">
                <DropdownMenuLabel className="truncate text-xs font-normal text-hso-muted">{email}</DropdownMenuLabel>
                <DropdownMenuItem asChild className="min-h-10 rounded-hso-sm text-sm"><Link to="/profile"><UserIcon className="mr-2 h-4 w-4" />Profile</Link></DropdownMenuItem>
                <DropdownMenuItem onSelect={() => void signOut()} className="min-h-10 rounded-hso-sm text-sm"><LogOut className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="secondary" onClick={goAuth} className="ml-1">Sign in</Button>
          )}
        </nav>

        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" icon className="md:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="hso-ds w-[86vw] max-w-sm border-hso-line bg-hso-surface p-0">
            <SheetHeader className="border-b border-hso-line px-4 py-3 text-left">
              <SheetTitle className="text-base font-semibold text-hso-fg">Menu</SheetTitle>
            </SheetHeader>
            <nav aria-label="Mobile" className="flex flex-col p-2 text-base">
              <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-hso-subtle">Categories</p>
              {CATEGORY_SLUGS.map((slug) => (
                <Link key={slug} to={`/categories/${slug}`} onClick={() => setMenuOpen(false)} className="flex min-h-hso-tap items-center rounded-hso px-3 text-hso-fg hover:bg-hso-sunken">
                  {shortName(slug)}
                </Link>
              ))}
              <div className="my-2 border-t border-hso-line" />
              {[
                ["/deadlines", "Deadlines"],
                ["/collections", "Collections"],
                ["/submit", "Submit an opportunity"],
                ["/about", "About HSO"],
              ].map(([to, label]) => (
                <Link key={to} to={to} onClick={() => setMenuOpen(false)} className="flex min-h-hso-tap items-center rounded-hso px-3 text-hso-fg hover:bg-hso-sunken">
                  {label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => { setMenuOpen(false); setShowShelf(true); }}
                className="flex min-h-hso-tap items-center gap-2 rounded-hso px-3 text-left text-hso-fg hover:bg-hso-sunken"
              >
                <Bookmark className="h-4 w-4" aria-hidden="true" /> My Shelf{savedCount > 0 ? ` (${savedCount})` : ""}
              </button>
              <div className="my-2 border-t border-hso-line" />
              {session ? (
                <>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex min-h-hso-tap items-center rounded-hso px-3 text-hso-fg hover:bg-hso-sunken">Profile</Link>
                  <button type="button" onClick={() => void signOut()} className="flex min-h-hso-tap items-center rounded-hso px-3 text-left text-hso-fg hover:bg-hso-sunken">Sign out</button>
                </>
              ) : (
                <Button onClick={() => { setMenuOpen(false); goAuth(); }} className="mx-1 mt-1">Sign in</Button>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
      {shelfLoaded && (
        <Suspense fallback={null}>
          <CollectionsPanel open={showShelf} onOpenChange={setShowShelf} />
        </Suspense>
      )}
    </header>
  );
}
