import { allOpportunities } from "@/data/opportunities";
import { FilterDropdown } from "@/components/FilterDropdown";

export type ExtraFilterState = {
  field: string;
  country: string; // repurposed: region (All U.S. | Northeast | South | Midwest | West | Online | Hybrid)
  status: "All" | "Open" | "Closing soon" | "Rolling" | "Closed";
  freeOnly: boolean;
  deadlineMonth: string; // "All" or "1".."12"
};

export const DEFAULT_EXTRA: ExtraFilterState = {
  field: "All",
  country: "All",
  status: "All",
  freeOnly: false,
  deadlineMonth: "All",
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export function ExtraFilters({ value, onChange }: { value: ExtraFilterState; onChange: (v: ExtraFilterState) => void }) {
  const fields = Array.from(new Set(allOpportunities.flatMap((o) => o.fields))).sort();
  const regions = ["All", "Northeast", "South", "Midwest", "West", "Online", "Hybrid"];

  return (
    <div className="flex flex-wrap gap-2 text-sm">
      <FilterDropdown
        label="Field"
        value={value.field}
        searchable
        searchPlaceholder="Search fields…"
        onChange={(v) => onChange({ ...value, field: v })}
        options={[{ value: "All", label: "All fields" }, ...fields.map((f) => ({ value: f, label: f }))]}
      />
      <FilterDropdown
        label="Region"
        value={value.country}
        onChange={(v) => onChange({ ...value, country: v })}
        options={regions.map((c) => ({ value: c, label: c === "All" ? "All U.S." : c }))}
      />
      <FilterDropdown
        label="Status"
        value={value.status}
        onChange={(v) => onChange({ ...value, status: v as ExtraFilterState["status"] })}
        options={(["All","Open","Closing soon","Rolling","Closed"] as const).map((s) => ({ value: s, label: s }))}
      />
      <FilterDropdown
        label="Deadline"
        value={value.deadlineMonth}
        onChange={(v) => onChange({ ...value, deadlineMonth: v })}
        options={[{ value: "All", label: "Any month" }, ...MONTHS.map((m, i) => ({ value: String(i+1), label: m }))]}
      />
      <label className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 shadow-soft transition-colors ${value.freeOnly ? "border-coral bg-coral/10 text-coral" : "border-border bg-card text-foreground hover:border-foreground"}`}>
        <input type="checkbox" checked={value.freeOnly} onChange={(e) => onChange({ ...value, freeOnly: e.target.checked })} className="h-3.5 w-3.5 accent-coral" />
        Free / aid available
      </label>
    </div>
  );
}