import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, MapPin } from "lucide-react";
import type { Opportunity } from "@/data/opportunities";
import { CostBadge, GradesBadge } from "./Badge";
import { OrgMark } from "./OrgMark";
import { placeLabel } from "@/lib/opportunityFacts";

/**
 * Many near-identical listings (one program offered at 20 sites) as one card
 * that expands to the list of sites. Native <details>, so it works without
 * JavaScript and every site's link is in the server-rendered HTML.
 */
export function ListingGroupCard({ name, items, headingLevel = 3, index = 0 }: { name: string; items: Opportunity[]; headingLevel?: 2 | 3; index?: number }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const orgs = [...new Set(items.map((o) => o.org))];
  const first = items[0];
  const costs = [...new Set(items.map((o) => o.cost))];
  return (
    <article style={{ "--i": index } as CSSProperties} className="hso-rise hso-lift rounded-hso border border-hso-line bg-hso-surface hover:border-hso-line-strong">
      <details className="hso-details group/details">
        <summary className="flex min-h-hso-tap cursor-pointer list-none gap-3 rounded-hso p-4 hover:bg-hso-sunken focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hso-coral-strong [&::-webkit-details-marker]:hidden">
          <OrgMark org={orgs.length === 1 ? orgs[0] : name} />
          <div className="min-w-0 flex-1">
            <H className="text-base font-semibold leading-snug text-hso-fg sm:text-lg">{name}</H>
            <p className="mt-0.5 truncate text-sm text-hso-muted">
              {orgs.length === 1 ? orgs[0] : `${orgs.length} organizations`}
            </p>
            <p className="mt-0.5 text-sm text-hso-subtle">{items.length} locations</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {costs.length === 1 && <CostBadge cost={first.cost} />}
              <GradesBadge grades={[...new Set(items.flatMap((o) => o.grades))]} />
            </div>
          </div>
          <span className="inline-flex h-11 shrink-0 items-center gap-1 self-start text-sm font-semibold text-hso-coral-strong">
            <span className="hidden sm:inline group-open/details:hidden">Show all</span>
            <span className="hidden sm:group-open/details:inline">Hide</span>
            <ChevronDown className="h-5 w-5 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-open/details:rotate-180" aria-hidden="true" />
          </span>
        </summary>
        <ul className="divide-y divide-hso-line border-t border-hso-line">
          {items.map((o) => (
            <li key={o.id}>
              <Link
                to={`/opportunities/${o.id}`}
                className="flex min-h-hso-tap items-center justify-between gap-3 px-4 py-2.5 text-sm hover:bg-hso-sunken focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-hso-coral-strong"
              >
                <span className="min-w-0 truncate font-medium text-hso-fg">
                  {/* The card title already names the program; each row names the site. */}
                  {o.title.startsWith(`${name} at `) ? o.title.slice(name.length + 4) : o.title}
                </span>
                <span className="flex shrink-0 items-center gap-1 text-hso-subtle">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {placeLabel(o)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </article>
  );
}
