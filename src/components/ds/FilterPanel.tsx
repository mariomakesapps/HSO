import type { ReactNode } from "react";
import type { Category } from "@/data/opportunities";
import type { Cost, FilterState } from "@/components/Filters";
import type { DeadlineStatus, ExtraFilterState } from "@/components/ExtraFilters";
import { cn } from "@/lib/utils";

/** Per-option result counts, from facetCounts() in src/lib/filterSort.ts. */
export interface FilterFacets {
  categories: Record<string, number>;
  grades: Record<string, number>;
  costs: Record<string, number>;
  formats: Record<string, number>;
  states: Record<string, number>;
}

export interface FilterPanelProps {
  filters: FilterState;
  extra: ExtraFilterState;
  facets: FilterFacets;
  onFilters: (next: FilterState) => void;
  onExtra: (next: ExtraFilterState) => void;
  onClear: () => void;
  /** Hide the category group (a category page is already one category). */
  hideCategory?: boolean;
  className?: string;
}

const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: "Internship", label: "Internships" },
  { value: "Summer Program", label: "Summer programs" },
  { value: "Scholarship", label: "Scholarships" },
  { value: "Research", label: "Research" },
  { value: "Competition", label: "Competitions" },
  { value: "Fellowship", label: "Fellowships" },
];

const DEADLINE_OPTIONS: { value: DeadlineStatus; label: string }[] = [
  { value: "Closing soon", label: "Closing in 30 days" },
  { value: "Open", label: "Open, more than 30 days" },
  { value: "Rolling", label: "No date posted yet" },
];

const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    // The divider sits on a wrapper: a fieldset's own border breaks around its legend.
    <div className="border-t border-hso-line py-3 first:border-t-0 first:pt-0">
      <fieldset>
        <legend className="mb-1 text-sm font-semibold text-hso-fg">{title}</legend>
        {children}
      </fieldset>
    </div>
  );
}

function Check({ checked, onChange, label, count }: { checked: boolean; onChange: () => void; label: string; count?: number }) {
  return (
    <label className="flex min-h-hso-tap cursor-pointer items-center gap-3 rounded-hso px-1 text-sm text-hso-fg transition-colors duration-150 hover:bg-hso-sunken">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="hso-check shrink-0 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-hso-coral-strong"
      />
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="text-xs tabular-nums text-hso-subtle">{count.toLocaleString("en-US")}</span>}
    </label>
  );
}

/**
 * The filter column: category, grade, cost, paid, remote, state, deadline.
 * Controlled; it reads and writes the same FilterState / ExtraFilterState the
 * homepage already keeps in the URL, so filtering logic is unchanged.
 * Options that would return nothing are hidden unless already selected.
 */
export function FilterPanel({ filters, extra, facets, onFilters, onExtra, onClear, hideCategory, className }: FilterPanelProps) {
  const active =
    filters.categories.length + filters.grades.length + filters.costs.length + filters.formats.length +
    extra.states.length + extra.statuses.length;
  const setCost = (c: Cost) => onFilters({ ...filters, costs: toggle(filters.costs, c) });
  const states = Object.entries(facets.states)
    .filter(([s, n]) => n > 0 && s !== "Other" && s !== "Online")
    .sort(([a], [b]) => (a === "Nationwide" ? -1 : b === "Nationwide" ? 1 : a.localeCompare(b)));

  return (
    <div className={cn("hso-ds", className)}>
      <div className="mb-2 flex min-h-hso-tap items-center justify-between">
        <h2 className="text-base font-semibold text-hso-fg">Filters</h2>
        {active > 0 && (
          <button type="button" onClick={onClear} className="hso-press hso-rise min-h-hso-tap rounded-hso px-2 text-sm font-semibold text-hso-coral-strong hover:underline">
            Clear all ({active})
          </button>
        )}
      </div>

      {!hideCategory && (
        <Group title="Category">
          {CATEGORY_OPTIONS.filter((o) => (facets.categories[o.value] ?? 0) > 0 || filters.categories.includes(o.value)).map((o) => (
            <Check
              key={o.value}
              label={o.label}
              count={facets.categories[o.value] ?? 0}
              checked={filters.categories.includes(o.value)}
              onChange={() => onFilters({ ...filters, categories: toggle(filters.categories, o.value) })}
            />
          ))}
        </Group>
      )}

      <Group title="Grade">
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {[9, 10, 11, 12].map((g) => {
            const on = filters.grades.includes(g);
            return (
              <button
                key={g}
                type="button"
                aria-pressed={on}
                onClick={() => onFilters({ ...filters, grades: toggle(filters.grades, g) })}
                className={cn(
                  "hso-press min-h-hso-tap rounded-hso border text-sm font-semibold",
                  on ? "border-hso-coral bg-hso-coral-tint text-hso-coral-strong" : "border-hso-line text-hso-fg hover:border-hso-line-strong",
                )}
              >
                {g}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Cost">
        <Check label="Free" count={facets.costs.Free ?? 0} checked={filters.costs.includes("Free")} onChange={() => setCost("Free")} />
        <Check label="Tuition or fee" count={facets.costs.Paid ?? 0} checked={filters.costs.includes("Paid")} onChange={() => setCost("Paid")} />
      </Group>

      <Group title="Paid">
        <Check label="Pays you a stipend or wage" count={facets.costs.Stipend ?? 0} checked={filters.costs.includes("Stipend")} onChange={() => setCost("Stipend")} />
      </Group>

      <Group title="Remote">
        <Check
          label="Online only"
          count={facets.formats.Online ?? 0}
          checked={filters.formats.includes("Online")}
          onChange={() => onFilters({ ...filters, formats: toggle(filters.formats, "Online") })}
        />
      </Group>

      <Group title="State">
        <label htmlFor="hso-filter-state" className="sr-only">State</label>
        <select
          id="hso-filter-state"
          value={extra.states[0] ?? ""}
          onChange={(e) => onExtra({ ...extra, states: e.target.value ? [e.target.value] : [] })}
          className="mt-1 h-11 w-full rounded-hso border border-hso-line-strong bg-hso-surface px-2 text-sm text-hso-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-hso-coral-strong"
        >
          <option value="">Any state</option>
          {states.map(([s, n]) => (
            <option key={s} value={s}>
              {s === "Nationwide" ? "Open nationwide" : s} ({n})
            </option>
          ))}
        </select>
      </Group>

      <Group title="Deadline">
        {DEADLINE_OPTIONS.map((o) => (
          <Check
            key={o.value}
            label={o.label}
            checked={extra.statuses.includes(o.value)}
            onChange={() => onExtra({ ...extra, statuses: toggle(extra.statuses, o.value) })}
          />
        ))}
      </Group>
    </div>
  );
}
