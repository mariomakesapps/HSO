import { ArrowUpDown } from "lucide-react";

export type SortKey =
  | "recommended"
  | "deadline-soon"
  | "newest"
  | "free-first"
  | "online-first"
  | "prestige";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "deadline-soon", label: "Deadline soon" },
  { value: "newest", label: "Newest added" },
  { value: "free-first", label: "Free first" },
  { value: "online-first", label: "Online first" },
  { value: "prestige", label: "Highest prestige" },
];

export function SortBar({ value, onChange, count }: { value: SortKey; onChange: (v: SortKey) => void; count: number }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-soft">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{count.toLocaleString()} results</p>
      <label className="flex items-center gap-2 text-sm">
        <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">Sort by</span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as SortKey)}
          className="cursor-pointer bg-transparent font-semibold text-foreground outline-none"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>
    </div>
  );
}