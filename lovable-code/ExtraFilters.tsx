import { allOpportunities } from "@/data/opportunities";
import { MultiFilterDropdown } from "@/components/MultiFilterDropdown";

/**
 * Secondary filters. Like FilterState, every dimension is a list and an empty
 * list means "no constraint" — see components/Filters.tsx.
 */
export type DeadlineStatus = "Open" | "Closing soon" | "Rolling" | "Closed";

export type ExtraFilterState = {
  fields: string[];
  states: string[];
  statuses: DeadlineStatus[];
  freeOnly: boolean;
  deadlineMonths: string[];
};

export const DEFAULT_EXTRA: ExtraFilterState = {
  fields: [],
  states: [],
  statuses: [],
  freeOnly: false,
  deadlineMonths: [],
};

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
  "District of Columbia",
] as const;

// Only the main subjects. Listings carry their main subject alongside any specific tag
// ("Music" also has "Arts", "Physics" also has "STEM"), so these options cover the
// catalogue without a hundred one-off choices. A listing that has no main subject yet
// keeps its own tags in the list, so it can always be found; once every listing has a
// main subject, only the main subjects are shown.
const MAIN_SUBJECTS = [
  "STEM", "Math", "Computer Science", "Biology", "Engineering", "Medicine", "Environment",
  "Business", "Policy", "Humanities", "Writing", "Arts", "Leadership", "Research", "Career", "Trades", "Education",
];
const PRESENT_FIELDS = new Set(allOpportunities.flatMap((o) => o.fields));
const UNGROUPED_FIELDS = new Set(
  allOpportunities.filter((o) => !o.fields.some((f) => MAIN_SUBJECTS.includes(f))).flatMap((o) => o.fields),
);
const FILTER_FIELDS = [...MAIN_SUBJECTS.filter((f) => PRESENT_FIELDS.has(f)), ...UNGROUPED_FIELDS].sort();

/**
 * "Nationwide" is offered alongside the states because a national program is
 * open to a student in any state — for the ~45 states this catalog covers only
 * thinly, that is usually the more useful answer than their own state.
 */
const FILTER_STATES = ["Nationwide", ...STATES];

export const STATUS_OPTIONS: { value: DeadlineStatus; label: string }[] = [
  { value: "Open", label: "Open now" },
  { value: "Closing soon", label: "Closing soon" },
  { value: "Rolling", label: "TBA / rolling" },
  { value: "Closed", label: "Closed" },
];

export function ExtraFilters({
  value,
  onChange,
  facets,
}: {
  value: ExtraFilterState;
  onChange: (v: ExtraFilterState) => void;
  /** Result counts per option, so dead-end choices can be hidden. */
  facets?: { fields?: Record<string, number>; states?: Record<string, number> };
}) {
  return (
    <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-1">
      <MultiFilterDropdown
        fullWidth
        label="Field"
        allLabel="All fields"
        counts={facets?.fields}
        hideEmpty
        selected={value.fields}
        searchable
        searchPlaceholder="Search fields..."
        onChange={(v) => onChange({ ...value, fields: v })}
        options={FILTER_FIELDS.map((f) => ({ value: f, label: f }))}
      />
      <MultiFilterDropdown
        fullWidth
        label="State"
        allLabel="All states"
        counts={facets?.states}
        hideEmpty
        selected={value.states}
        onChange={(v) => onChange({ ...value, states: v })}
        searchable
        searchPlaceholder="Search states..."
        options={FILTER_STATES.map((c) => ({ value: c, label: c }))}
      />
      <MultiFilterDropdown
        fullWidth
        label="Status"
        allLabel="Any status"
        selected={value.statuses}
        onChange={(v) => onChange({ ...value, statuses: v as DeadlineStatus[] })}
        options={STATUS_OPTIONS}
      />
      <MultiFilterDropdown
        fullWidth
        label="Deadline"
        allLabel="Any month"
        selected={value.deadlineMonths}
        onChange={(v) => onChange({ ...value, deadlineMonths: v })}
        options={MONTHS.map((m, i) => ({ value: String(i + 1), label: m }))}
      />
      <label
        className={`flex h-11 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold shadow-soft transition-[transform,border-color,background-color] hover:-translate-y-0.5 active:translate-y-0 ${
          value.freeOnly
            ? "border-coral bg-coral/10 text-coral"
            : "border-border bg-card/90 text-foreground hover:border-foreground"
        }`}
      >
        <input
          type="checkbox"
          checked={value.freeOnly}
          onChange={(e) => onChange({ ...value, freeOnly: e.target.checked })}
          className="h-3.5 w-3.5 accent-coral"
        />
        Free / aid available
      </label>
    </div>
  );
}
