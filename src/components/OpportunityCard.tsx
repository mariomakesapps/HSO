import { Bookmark, BookmarkCheck, ExternalLink, FolderPlus, MapPin, GraduationCap, DollarSign, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Opportunity } from "@/data/opportunities";
import { store, useStore } from "@/store/collections";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getDeadlineStatus, STATUS_STYLES } from "@/lib/deadline";
import { useAuthSession, authRedirectHref } from "@/hooks/useAuthSession";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const CATEGORY_BADGE: Record<string, string> = {
  Research: "bg-sage/15 text-sage border border-sage/30",
  Internship: "bg-ink/10 text-ink border border-ink/20",
  Competition: "bg-coral/15 text-coral border border-coral/30",
  "Summer Program": "bg-ochre/20 text-ink border border-ochre/40",
  Scholarship: "bg-sage/15 text-sage border border-sage/30",
  Volunteer: "bg-ink/10 text-ink border border-ink/20",
  Fellowship: "bg-coral/15 text-coral border border-coral/30",
};

export function OpportunityCard({ opp, index = 0 }: { opp: Opportunity; index?: number }) {
  const s = useStore();
  const { isAuthed } = useAuthSession();
  const navigate = useNavigate();
  const fav = s.favorites.includes(opp.id);
  const dl = getDeadlineStatus(opp.deadline);
  const isClosed = dl.status === "closed";
  const linkUrl = opp.url && opp.url !== "#"
    ? opp.url
    : `https://duckduckgo.com/?q=${encodeURIComponent(`${opp.title} ${opp.org} high school`)}`;

  const requireAuth = (e: React.MouseEvent) => {
    if (!isAuthed) {
      e.preventDefault();
      toast.message("Sign in to unlock", { description: "Create a free account to save favorites and visit official program links." });
      navigate(authRedirectHref(`/opportunities/${opp.id}`));
    }
  };

  return (
    <article
      className={cn(
        "group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-all duration-200 hover:border-ink/30 hover:shadow-soft",
        isClosed && "opacity-70"
      )}
      style={{ animationDelay: `${Math.min(index * 30, 240)}ms` }}
    >
      {/* Top row: category + status + actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", CATEGORY_BADGE[opp.category])}>
            {opp.category}
          </span>
          <span className={cn("rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", STATUS_STYLES[dl.status])}>
            {dl.status === "open" ? "Open" : dl.status === "closing-soon" ? "Closing soon" : dl.status === "rolling" ? "Rolling" : "Closed"}
          </span>
        </div>
        <div className="-mr-2 -mt-1 flex items-center">
          {isAuthed ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-ink">
                <FolderPlus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Add to collection</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {s.collections.length === 0 && <DropdownMenuItem disabled>No collections yet</DropdownMenuItem>}
              {s.collections.map((c) => {
                const inIt = c.opportunityIds.includes(opp.id);
                return (
                  <DropdownMenuItem
                    key={c.id}
                    onClick={() => {
                      store.toggleInCollection(c.id, opp.id);
                      toast.success(inIt ? `Removed from ${c.name}` : `Added to ${c.name}`);
                    }}
                  >
                    <span className="mr-2">{c.emoji}</span>
                    <span className="flex-1">{c.name}</span>
                    {inIt && <span className="text-xs text-muted-foreground">✓</span>}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          ) : (
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-ink" onClick={requireAuth} aria-label="Sign in to use collections">
              <FolderPlus className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost" size="icon"
            className="h-8 w-8 rounded-lg text-muted-foreground hover:text-coral"
            onClick={() => {
              if (!isAuthed) { requireAuth({ preventDefault: () => {} } as any); return; }
              store.toggleFavorite(opp.id);
              toast.success(fav ? "Removed from favorites" : "Saved to favorites");
            }}
            aria-label={fav ? "Unsave" : "Save"}
          >
            {fav ? <BookmarkCheck className="h-4 w-4 text-coral" /> : <Bookmark className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Title + org */}
      <Link to={`/opportunities/${opp.id}`} className="mt-3 block">
        <h3 className="font-display text-lg font-semibold leading-snug text-ink group-hover:text-coral sm:text-xl">
          {opp.title}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">{opp.org}</p>
      </Link>

      {/* Description */}
      <p className="mt-3 text-sm leading-relaxed text-foreground/80 line-clamp-3">{opp.blurb}</p>

      {/* Meta */}
      <div className="mt-auto grid grid-cols-2 gap-x-4 gap-y-2 pt-4 text-xs text-muted-foreground">
        <Meta icon={<MapPin className="h-3.5 w-3.5" />}>{opp.location}</Meta>
        <Meta icon={<DollarSign className="h-3.5 w-3.5" />}>{opp.cost}</Meta>
        <Meta icon={<GraduationCap className="h-3.5 w-3.5" />}>Grades {opp.grades[0]}–{opp.grades[opp.grades.length - 1]}</Meta>
        <Meta>
          <span className={cn(dl.status === "closing-soon" && "font-semibold text-coral")}>{dl.label}</span>
        </Meta>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
        <Link to={`/opportunities/${opp.id}`} className="text-sm font-medium text-muted-foreground hover:text-ink">
          Details
        </Link>
        {isAuthed ? (
          <a
            href={linkUrl} target="_blank" rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-ink px-3.5 py-2 text-sm font-semibold text-cream transition-colors hover:bg-coral"
          >
            Visit program <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : (
          <Link
            to={authRedirectHref(`/opportunities/${opp.id}`)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:border-ink/40 hover:text-ink"
            title="Sign in to view link"
          >
            <Lock className="h-3.5 w-3.5" /> Sign in to view link
          </Link>
        )}
      </div>
    </article>
  );
}

function Meta({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 truncate">
      {icon}
      <span className="truncate">{children}</span>
    </div>
  );
}