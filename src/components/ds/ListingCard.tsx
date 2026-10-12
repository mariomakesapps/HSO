import { memo, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { MapPin, Monitor } from "lucide-react";
import type { Opportunity } from "@/data/opportunities";
import { cn } from "@/lib/utils";
import { CostBadge, DeadlineChip, GradesBadge } from "./Badge";
import { OrgMark } from "./OrgMark";
import { SaveButton } from "./SaveButton";
import { CategoryTag } from "./CategoryTag";
import { placeLabel } from "@/lib/opportunityFacts";

/**
 * One opportunity, LinkedIn-jobs style: mark, title, organization, place, then a
 * row of deadline / cost / grade badges, and a save button.
 *
 * The whole card is clickable through the title link's stretched ::after, which
 * keeps a single real <a> in the HTML (one link per card for crawlers and screen
 * readers) while the save button sits above it and stays its own control.
 */
function ListingCardImpl({ opp, headingLevel = 3, index = 0, className }: { opp: Opportunity; headingLevel?: 2 | 3; index?: number; className?: string }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const remote = opp.format === "Online";
  return (
    <article
      style={{ "--i": index } as CSSProperties}
      className={cn(
        "hso-rise hso-lift group relative flex gap-3 rounded-hso border border-hso-line bg-hso-surface p-4",
        "hover:border-hso-line-strong focus-within:border-hso-line-strong",
        className,
      )}
    >
      <OrgMark org={opp.org} url={opp.url} />
      <div className="min-w-0 flex-1">
        <CategoryTag category={opp.category} className="mb-1" />
        <H className="text-base font-semibold leading-snug text-hso-fg sm:text-lg">
          <Link
            to={`/opportunities/${opp.id}`}
            className="rounded-hso-sm after:absolute after:inset-0 after:rounded-hso after:content-[''] decoration-hso-coral/60 underline-offset-2 group-hover:underline focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-hso-coral-strong"
          >
            {opp.title}
          </Link>
        </H>
        <p className="mt-0.5 truncate text-sm text-hso-muted">{opp.org}</p>
        <p className="mt-0.5 flex items-center gap-1 text-sm text-hso-subtle">
          {remote ? <Monitor className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
          <span className="truncate">{placeLabel(opp)}</span>
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <DeadlineChip deadline={opp.deadline} opensAt={opp.opensAt} />
          <CostBadge cost={opp.cost} />
          <GradesBadge grades={opp.grades} />
        </div>
      </div>
      <SaveButton id={opp.id} title={opp.title} className="relative z-10 -mr-2 -mt-2 shrink-0" />
    </article>
  );
}

export const ListingCard = memo(ListingCardImpl);
