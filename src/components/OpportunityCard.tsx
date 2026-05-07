import { Bookmark, BookmarkCheck, ExternalLink, FolderPlus, MapPin, CalendarDays } from "lucide-react";
import { Opportunity } from "@/data/opportunities";
import { store, useStore } from "@/store/collections";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const accentByCategory: Record<string, string> = {
  Research: "bg-sage text-sage-foreground",
  Internship: "bg-ink text-cream",
  Competition: "bg-coral text-coral-foreground",
  "Summer Program": "bg-ochre text-ochre-foreground",
  Scholarship: "bg-sage text-sage-foreground",
  Volunteer: "bg-ink text-cream",
  Fellowship: "bg-coral text-coral-foreground",
};

export function OpportunityCard({ opp, index = 0 }: { opp: Opportunity; index?: number }) {
  const s = useStore();
  const fav = s.favorites.includes(opp.id);
  const deadline = new Date(opp.deadline);
  const daysLeft = Math.ceil((deadline.getTime() - Date.now()) / 86400000);
  const isClosed = daysLeft <= 0;
  const linkUrl =
    opp.url && opp.url !== "#"
      ? opp.url
      : `https://duckduckgo.com/?q=${encodeURIComponent(`${opp.title} ${opp.org} high school`)}&kl=us-en`;

  const openLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const win = window.open(linkUrl, "_blank", "noopener,noreferrer");
    if (!win) {
      try {
        if (window.top) window.top.location.href = linkUrl;
        else window.location.href = linkUrl;
      } catch {
        window.location.href = linkUrl;
      }
    }
  };

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-500 hover:-translate-y-1 hover:shadow-editorial animate-fade-up",
        isClosed && "opacity-50 grayscale hover:opacity-90 hover:grayscale-0"
      )}
      style={{ animationDelay: `${Math.min(index * 40, 300)}ms` }}
    >
      {isClosed && (
        <span className="absolute right-3 top-3 z-10 rounded-full bg-foreground/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-background">
          Closed
        </span>
      )}
      <div className="flex items-start justify-between gap-3 p-4 pb-3 sm:p-5">
        <span className={cn("rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase", accentByCategory[opp.category])}>
          {opp.category}
        </span>
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <FolderPlus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Add to collection</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {s.collections.length === 0 && (
                <DropdownMenuItem disabled>No collections yet</DropdownMenuItem>
              )}
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
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => {
              store.toggleFavorite(opp.id);
              toast.success(fav ? "Removed from favorites" : "Saved to favorites");
            }}
          >
            {fav ? <BookmarkCheck className="h-4 w-4 text-coral" /> : <Bookmark className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 sm:px-5 sm:pb-5">
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{opp.org}</p>
        <h3 className="mt-2 font-display text-xl leading-tight text-foreground text-balance break-words sm:text-2xl">
          {opp.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">{opp.blurb}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {opp.fields.slice(0, 3).map((f) => (
            <span key={f} className="rounded-full bg-secondary px-2.5 py-0.5 text-[11px] font-medium text-secondary-foreground">
              {f}
            </span>
          ))}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate">{opp.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" />
            <span className={cn(daysLeft < 30 && daysLeft > 0 && "text-coral font-semibold")}>
              {daysLeft > 0 ? `${daysLeft}d left` : "Closed"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold">{opp.cost}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>Grades {opp.grades[0]}–{opp.grades[opp.grades.length - 1]}</span>
          </div>
        </div>

        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={openLink}
          title={linkUrl}
          className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-ink px-4 py-3 text-sm font-semibold text-cream transition-colors hover:bg-coral hover:text-coral-foreground sm:w-auto sm:justify-start sm:bg-transparent sm:px-0 sm:py-0 sm:text-foreground sm:underline-offset-4 sm:hover:bg-transparent sm:hover:text-coral sm:hover:underline"
        >
          {isClosed ? "View details" : "Visit program"} <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
}