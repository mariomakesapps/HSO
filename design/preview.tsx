import { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { MemoryRouter } from "react-router-dom";
import "@fontsource-variable/inter";
import "../src/index.css";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { allOpportunities, locationState } from "@/data/opportunities";
import { applyFilters, facetCounts } from "@/lib/filterSort";
import { EMPTY_FILTERS, type FilterState } from "@/components/Filters";
import { DEFAULT_EXTRA, type ExtraFilterState } from "@/components/ExtraFilters";
import { groupSimilarListings } from "@/lib/grouping";
import { Bookmark } from "lucide-react";
import {
  Badge, Button, CostBadge, DeadlineChip, FilterPanel, GradesBadge, ListingCard, ListingGroupCard,
  MobileFilters, OrgMark, Surface, TopNav,
} from "@/components/ds";

/**
 * Design-system preview (dev only). Shows the tokens and every shared component
 * with real catalogue data, at desktop and phone widths, for review before the
 * components are applied to pages.
 */
const SWATCHES = [
  ["canvas", "--hso-canvas", "Page background"],
  ["surface", "--hso-surface", "Cards, nav"],
  ["line", "--hso-line", "Borders"],
  ["fg", "--hso-fg", "Text"],
  ["muted", "--hso-fg-muted", "Secondary text"],
  ["coral", "--hso-coral", "Buttons, links"],
  ["coral-tint", "--hso-coral-tint", "Selected, urgent"],
  ["green", "--hso-green", "Good status"],
  ["green-tint", "--hso-green-tint", "Free, Paid, Open"],
];

const SAMPLE_IDS = ["regeneron-sts", "ccc-youthaction-nyc", "nyt-essay", "rsi", "simr", "nih-summer"];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-8">
      <h2 className="mb-3 text-xl font-bold text-hso-fg">{title}</h2>
      {children}
    </section>
  );
}

function Preview() {
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [extra, setExtra] = useState<ExtraFilterState>(DEFAULT_EXTRA);
  const facets = useMemo(
    () => ({
      categories: facetCounts(allOpportunities, filters, extra, "categories", (o) => [o.category]),
      grades: facetCounts(allOpportunities, filters, extra, "grades", (o) => o.grades.map(String)),
      costs: facetCounts(allOpportunities, filters, extra, "costs", (o) => [o.cost]),
      formats: facetCounts(allOpportunities, filters, extra, "formats", (o) => [o.format]),
      states: facetCounts(allOpportunities, filters, extra, "states", (o) => [locationState(o.location)]),
    }),
    [filters, extra],
  );
  const results = useMemo(() => applyFilters(allOpportunities, filters, extra), [filters, extra]);
  const samples = SAMPLE_IDS.map((id) => allOpportunities.find((o) => o.id === id)!).filter(Boolean);
  const group = groupSimilarListings(allOpportunities.filter((o) => o.title.startsWith("Summer Youth Employment at"))).find((r) => r.kind === "group");
  const panel = { filters, extra, facets, onFilters: setFilters, onExtra: setExtra, onClear: () => { setFilters(EMPTY_FILTERS); setExtra(DEFAULT_EXTRA); } };

  return (
    <div className="hso-ds min-h-screen bg-hso-canvas font-sans text-hso-fg">
      <TopNav />
      <main className="mx-auto max-w-hso-page px-4 pb-16 pt-6">
        <h1 className="text-2xl font-bold sm:text-3xl">Design system preview</h1>
        <p className="mt-1 max-w-2xl text-base text-hso-muted">Tokens and shared components with real listings. Dev only, not a site page.</p>

        <Section title="Colors">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 lg:grid-cols-9">
            {SWATCHES.map(([name, v, use]) => (
              <div key={name}>
                <div className="h-14 rounded-hso border border-hso-line" style={{ background: `hsl(var(${v}))` }} />
                <p className="mt-1 text-xs font-semibold">{name}</p>
                <p className="text-xs text-hso-muted">{use}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Type">
          <Surface className="space-y-2 p-5">
            <p className="text-3xl font-bold">Page title 30 bold</p>
            <p className="text-xl font-bold">Section title 20 bold</p>
            <p className="text-lg font-semibold">Card title 18 semibold</p>
            <p className="text-base">Body 16 regular. Short sentences, plain words, line height 1.55 for easy reading.</p>
            <p className="text-sm text-hso-muted">Secondary 14, for organization names and metadata.</p>
            <p className="text-xs text-hso-muted">Meta 12, for badges and counts.</p>
          </Surface>
        </Section>

        <Section title="Buttons and badges">
          <Surface className="flex flex-wrap items-center gap-3 p-5">
            <Button>Apply on official site</Button>
            <Button variant="secondary">Sign in</Button>
            <Button variant="ghost">Clear filters</Button>
            <Button variant="ghost" icon aria-label="Save"><Bookmark className="h-5 w-5" /></Button>
            <span className="mx-2 h-6 w-px bg-hso-line" />
            <Badge tone="good">Free</Badge>
            <CostBadge cost="Stipend" />
            <CostBadge cost="Paid" />
            <GradesBadge grades={[10, 11, 12]} />
            <DeadlineChip deadline={new Date(Date.now() + 5 * 864e5).toISOString().slice(0, 10)} />
            <DeadlineChip deadline={new Date(Date.now() + 40 * 864e5).toISOString().slice(0, 10)} />
            <DeadlineChip deadline={null} />
            <DeadlineChip deadline="2026-01-01" />
            <span className="mx-2 h-6 w-px bg-hso-line" />
            <OrgMark org="Society for Science" /><OrgMark org="Citizens' Committee for Children" /><OrgMark org="The New York Times" />
          </Surface>
        </Section>

        <Section title="Home layout: filters, cards, right rail">
          <div className="mb-3 lg:hidden"><MobileFilters {...panel} resultCount={results.length} /></div>
          <div className="grid gap-6 lg:grid-cols-[var(--hso-col-left)_minmax(0,1fr)_var(--hso-col-right)]">
            <Surface as="aside" className="hidden self-start p-4 lg:block"><FilterPanel {...panel} /></Surface>
            <div className="space-y-3">
              <p className="text-sm text-hso-muted">{results.length.toLocaleString("en-US")} opportunities</p>
              {samples.map((o) => <ListingCard key={o.id} opp={o} />)}
              {group && group.kind === "group" && <ListingGroupCard name={group.name} items={group.items} />}
            </div>
            <Surface as="aside" className="hidden self-start p-4 text-sm text-hso-muted lg:block">
              Right rail (Deadlines this week, popular collections) is built in step 4 with the home page.
            </Surface>
          </div>
        </Section>
      </main>
      <Toaster />
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <MemoryRouter>
    <TooltipProvider>
      <Preview />
    </TooltipProvider>
  </MemoryRouter>,
);
