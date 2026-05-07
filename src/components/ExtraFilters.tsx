import { allOpportunities } from "@/data/opportunities";

export type ExtraFilterState = {
  field: string;
  country: string;
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
  const countries = Array.from(new Set(allOpportunities.map((o) => {
    const parts = o.location.split(",").map((p) => p.trim());
    return parts[parts.length - 1];
  }))).sort();

  return (
    <div className="flex flex-wrap gap-2 text-sm">
      <Pill>
        Field
        <select value={value.field} onChange={(e) => onChange({ ...value, field: e.target.value })} className="cursor-pointer bg-transparent font-semibold text-foreground outline-none">
          <option value="All">All</option>
          {fields.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </Pill>
      <Pill>
        Country
        <select value={value.country} onChange={(e) => onChange({ ...value, country: e.target.value })} className="cursor-pointer bg-transparent font-semibold text-foreground outline-none">
          <option value="All">All</option>
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Pill>
      <Pill>
        Status
        <select value={value.status} onChange={(e) => onChange({ ...value, status: e.target.value as ExtraFilterState["status"] })} className="cursor-pointer bg-transparent font-semibold text-foreground outline-none">
          {(["All","Open","Closing soon","Rolling","Closed"] as const).map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </Pill>
      <Pill>
        Deadline
        <select value={value.deadlineMonth} onChange={(e) => onChange({ ...value, deadlineMonth: e.target.value })} className="cursor-pointer bg-transparent font-semibold text-foreground outline-none">
          <option value="All">Any month</option>
          {MONTHS.map((m, i) => <option key={m} value={String(i+1)}>{m}</option>)}
        </select>
      </Pill>
      <label className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 shadow-soft transition-colors ${value.freeOnly ? "border-coral bg-coral/10 text-coral" : "border-border bg-card text-foreground hover:border-foreground"}`}>
        <input type="checkbox" checked={value.freeOnly} onChange={(e) => onChange({ ...value, freeOnly: e.target.checked })} className="h-3.5 w-3.5 accent-coral" />
        Free / aid available
      </label>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-soft transition-colors hover:border-foreground">
      <span className="text-muted-foreground">{(Array.isArray(children) ? children[0] : children) as any}</span>
      {(Array.isArray(children) ? children.slice(1) : null) as any}
    </label>
  );
}