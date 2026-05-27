import {
  Bookmark,
  BookmarkCheck,
  DollarSign,
  ExternalLink,
  GraduationCap,
  MapPin,
  Monitor,
} from "lucide-react";
import { memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Opportunity } from "@/data/opportunities";
import { store, useFavoriteStatus } from "@/store/collections";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getDeadlineStatus, STATUS_STYLES } from "@/lib/deadline";
import { useAuthSession, authRedirectHref } from "@/hooks/useAuthSession";
import { toast } from "sonner";

const CATEGORY_BADGE: Record<string, string> = {
  Research: "bg-sage/10 text-sage border border-sage/20",
  Internship: "bg-sky/15 text-ink border border-sky/30",
  Competition: "bg-coral/10 text-coral border border-coral/20",
  "Summer Program": "bg-ochre/15 text-ink border border-ochre/30",
  Scholarship: "bg-sunny/25 text-ink border border-sunny/40",
  Volunteer: "bg-sage/10 text-sage border border-sage/20",
  Fellowship: "bg-coral/10 text-coral border border-coral/20",
};

const CATEGORY_STRIP: Record<string, string> = {
  Research: "bg-sage",
  Internship: "bg-sky",
  Competition: "bg-coral",
  "Summer Program": "bg-ochre",
  Scholarship: "bg-sunny",
  Volunteer: "bg-sage",
  Fellowship: "bg-coral",
};

function OpportunityCardComponent({ opp, index = 0 }: { opp: Opportunity; index?: number }) {
  const { isAuthed } = useAuthSession();
  const navigate = useNavigate();
  const fav = useFavoriteStatus(opp.id);
  const dl = getDeadlineStatus(opp.deadline, opp.opensAt);
  const isClosed = dl.status === "closed";
  const linkUrl =
    opp.url && opp.url !== "#"
      ? opp.url
      : `https://duckduckgo.com/?q=${encodeURIComponent(`${opp.title} ${opp.org} high school`)}`;

  const requireAuth = (e: React.MouseEvent) => {
    if (!isAuthed) {
      e.preventDefault();
      toast.message("Sign in required", {
        description: "Create a free account to save opportunities and build folders.",
      });
      navigate(authRedirectHref(`/opportunities/${opp.id}`));
    }
  };

  const statusLabel =
    dl.status === "open"
      ? "Open"
      : dl.status === "closing-soon"
        ? "Closing soon"
        : dl.status === "opens-later"
          ? "Opens later"
          : dl.status === "rolling"
            ? "TBA"
            : "Closed";

  return (
    <article
      style={{ animationDelay: `${Math.min(index, 12) * 35}ms` }}
      className={cn(
        "hso-opportunity-card group hso-elevated-surface hso-surface-grid relative flex h-full transform-gpu flex-col overflow-hidden rounded-[1.5rem] p-5 transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-coral/25 hover:shadow-editorial active:scale-[0.99] active:translate-y-0",
        index < 18 && "animate-in fade-in-50 slide-in-from-bottom-3",
        isClosed && "opacity-70",
      )}
    >
      <span aria-hidden="true" className={cn("absolute left-0 top-0 h-full w-1", CATEGORY_STRIP[opp.category] ?? "bg-coral")} />
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cream/78 to-transparent" />
      <span aria-hidden="true" className="hso-data-rail pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-70" />

      <div className="relative flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide", CATEGORY_BADGE[opp.category])}>
            {opp.category}
          </span>
          <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide", STATUS_STYLES[dl.status])}>
            {statusLabel}
          </span>
        </div>

        <div className="-mr-1.5 -mt-1 flex items-center">
          {isAuthed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-muted-foreground/75 transition-[transform,background-color,color] hover:-translate-y-0.5 hover:bg-ink/5 hover:text-ink active:scale-[0.96]"
                  aria-label="Add to collection"
                >
                  <FolderPlus className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl border-border/70 bg-cream/95 p-1.5 shadow-editorial backdrop-blur-md">
                <DropdownMenuLabel className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Add to collection</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {collections.length === 0 && <DropdownMenuItem disabled>No collections yet</DropdownMenuItem>}
                {collections.map((c) => {
                  const inIt = c.opportunityIds.includes(opp.id);
                  return (
                    <DropdownMenuItem
                      key={c.id}
                      onClick={() => {
                        void store.toggleInCollection(c.id, opp.id).catch((error: any) => {
                          toast.error(error.message ?? "Could not update collection");
                        });
                        toast.success(inIt ? `Removed from ${c.name}` : `Added to ${c.name}`);
                      }}
                      className="rounded-xl"
                    >
                      <span className="flex-1">{c.name}</span>
                      {inIt && <span className="text-xs font-semibold text-coral">Added</span>}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-muted-foreground/75 transition-transform hover:-translate-y-0.5 hover:bg-ink/5 hover:text-ink active:scale-[0.96]"
              onClick={requireAuth}
              aria-label="Sign in to use collections"
            >
              <FolderPlus className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full border border-transparent text-muted-foreground/75 transition-[transform,border-color,background-color,color] hover:-translate-y-0.5 hover:border-coral/30 hover:bg-coral/10 hover:text-coral active:scale-[0.96]"
            onClick={() => {
              if (!isAuthed) {
                requireAuth({ preventDefault: () => {} } as React.MouseEvent);
                return;
              }
              void store.toggleFavorite(opp.id).catch((error: any) => {
                toast.error(error.message ?? "Could not save opportunity");
              });
              toast.success(fav ? "Removed from favorites" : "Saved to favorites");
            }}
            aria-label={fav ? "Unsave" : "Save"}
          >
            {fav ? <BookmarkCheck className="h-4 w-4 text-coral" /> : <Bookmark className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Link to={`/opportunities/${opp.id}`} className="relative mt-4 block">
        <h3 className="line-clamp-2 font-display text-xl font-semibold leading-tight tracking-tight text-ink transition-colors group-hover:text-coral">
          {opp.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-sm font-semibold text-muted-foreground">{opp.org}</p>
      </Link>

      <p className="relative mt-3 line-clamp-3 text-sm leading-relaxed text-foreground/72">{opp.blurb}</p>

      <div className="relative mt-5 grid grid-cols-2 gap-x-3 gap-y-2 border-t border-border/70 pt-4 text-[11px] font-medium text-muted-foreground">
        <Meta icon={<MapPin className="h-3.5 w-3.5" />}>{opp.location}</Meta>
        {opp.format && <Meta icon={<Monitor className="h-3.5 w-3.5" />}>{opp.format}</Meta>}
        <Meta icon={<DollarSign className="h-3.5 w-3.5" />}>{opp.cost}</Meta>
        <Meta icon={<GraduationCap className="h-3.5 w-3.5" />}>
          Gr {opp.grades[0]}-{opp.grades[opp.grades.length - 1]}
        </Meta>
      </div>

      <div className="relative mt-auto flex items-center gap-3 pt-5">
        <span className={cn("text-xs font-bold", dl.status === "closing-soon" ? "text-coral" : "text-muted-foreground")}>{dl.label}</span>
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-4 text-xs font-bold text-cream shadow-[0_14px_28px_-22px_hsl(var(--ink)/0.8)] transition-transform hover:-translate-y-0.5 hover:bg-coral active:scale-[0.98] active:translate-y-0"
        >
          Visit
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
}

function Meta({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5">
      <span className="shrink-0 text-coral/80">{icon}</span>
      <span className="truncate">{children}</span>
    </div>
  );
}

export const OpportunityCard = memo(OpportunityCardComponent, (prev, next) => prev.opp === next.opp && prev.index === next.index);
