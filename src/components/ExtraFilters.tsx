import { allOpportunities } from "@/data/opportunities";
import { FilterDropdown } from "@/components/FilterDropdown";

export type ExtraFilterState = {
  field: string;
  country: string;
  status: "All" | "Open" | "Closing soon" | "Rolling" | "Closed";
  freeOnly: boolean;
  deadlineMonth: string;
};

export const DEFAULT_EXTRA: ExtraFilterState = {
  field: "All",
  country: "All",
  status: "All",
  freeOnly: false,
  deadlineMonth: "All",
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

const FILTER_FIELDS = Array.from(new Set(allOpportunities.flatMap((o) => o.fields))).sort();
const FILTER_STATES = ["All", ...STATES, "Online", "Hybrid"];

export function ExtraFilters({
  value,
  onChange,
}: {
  value: ExtraFilterState;
  onChange: (v: ExtraFilterState) => void;
}) {
  return (
    <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-1">
      <FilterDropdown
        fullWidth
        label="Field"
        value={value.field}
        searchable
        searchPlaceholder="Search fields..."
        onChange={(v) => onChange({ ...value, field: v })}
        options={[{ value: "All", label: "All fields" }, ...FILTER_FIELDS.map((f) => ({ value: f, label: f }))]}
      />
      <FilterDropdown
        fullWidth
        label="State"
        value={value.country}
        onChange={(v) => onChange({ ...value, country: v })}
        searchable
        searchPlaceholder="Search states..."
        options={FILTER_STATES.map((c) => ({ value: c, label: c === "All" ? "All states" : c }))}
      />
      <FilterDropdown
        fullWidth
        label="Status"
        value={value.status}
        onChange={(v) => onChange({ ...value, status: v as ExtraFilterState["status"] })}
        options={(["All", "Open", "Closing soon", "Rolling", "Closed"] as const).map((s) => ({
          value: s,
          label: s === "Rolling" ? "TBA / rolling" : s,
        }))}
      />
      <FilterDropdown
        fullWidth
        label="Deadline"
        value={value.deadlineMonth}
        onChange={(v) => onChange({ ...value, deadlineMonth: v })}
        options={[{ value: "All", label: "Any month" }, ...MONTHS.map((m, i) => ({ value: String(i + 1), label: m }))]}
      />
      <label
        className={`flex h-11 cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold shadow-soft transition-[transform,border-color,background-color] hover:-translate-y-0.5 active:translate-y-0 ${
          value.freeOnly ? "border-coral bg-coral/10 text-coral" : "border-border bg-card/90 text-foreground hover:border-foreground"
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
