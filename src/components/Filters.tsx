import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Category } from "@/data/opportunities";

export type FilterState = {
  query: string;
  category: Category | "All";
  grade: number | "All";
  cost: "All" | "Free" | "Paid" | "Stipend";
  format: "All" | "In-person" | "Online" | "Hybrid";
};

const cats: (Category | "All")[] = ["All","Research","Internship","Competition","Summer Program","Scholarship","Volunteer","Fellowship"];

export function Filters({ value, onChange }: { value: FilterState; onChange: (v: FilterState) => void }) {
  return (
    <div className="space-y-5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={value.query}
          onChange={(e) => onChange({ ...value, query: e.target.value })}
          placeholder="Search programs, fields, organizations…"
          className="h-14 rounded-full border-border bg-card pl-14 pr-6 text-base shadow-soft focus-visible:ring-coral"
        />
      </div>

      <div className="-mx-2 flex gap-2 overflow-x-auto px-2 pb-1 scrollbar-none">
        {cats.map((c) => {
          const active = value.category === c;
          return (
            <button
              key={c}
              onClick={() => onChange({ ...value, category: c })}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all",
                active
                  ? "border-ink bg-ink text-cream"
                  : "border-border bg-card text-foreground hover:border-foreground"
              )}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        <Select label="Grade" value={String(value.grade)} options={[["All","All"],["9","9th"],["10","10th"],["11","11th"],["12","12th"]]} onChange={(v) => onChange({ ...value, grade: v === "All" ? "All" : Number(v) })} />
        <Select label="Cost" value={value.cost} options={[["All","All"],["Free","Free"],["Paid","Paid"],["Stipend","Stipend / Paid to me"]]} onChange={(v) => onChange({ ...value, cost: v as FilterState["cost"] })} />
        <Select label="Format" value={value.format} options={[["All","All"],["In-person","In-person"],["Online","Online"],["Hybrid","Hybrid"]]} onChange={(v) => onChange({ ...value, format: v as FilterState["format"] })} />
      </div>
    </div>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: [string,string][]; onChange: (v: string) => void }) {
  return (
    <label className="group flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm shadow-soft transition-colors hover:border-foreground">
      <span className="text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="cursor-pointer bg-transparent font-semibold text-foreground outline-none"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
    </label>
  );
}