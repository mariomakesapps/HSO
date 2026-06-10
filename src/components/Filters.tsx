import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from "@/components/ui/sheet";
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
  const [open, setOpen] = useState(false);
  const activeCount =
    (value.grade !== "All" ? 1 : 0) +
    (value.cost !== "All" ? 1 : 0) +
    (value.format !== "All" ? 1 : 0);

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground sm:left-5" />
        <Input
          value={value.query}
          onChange={(e) => onChange({ ...value, query: e.target.value })}
          placeholder="Search programs, fields, organizations…"
          className="h-12 rounded-full border-border bg-card pl-12 pr-4 text-base shadow-soft focus-visible:ring-coral sm:h-14 sm:pl-14 sm:pr-6"
        />
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:-mx-2 sm:px-2">
        {cats.map((c) => {
          const active = value.category === c;
          return (
            <button
              key={c}
              onClick={() => onChange({ ...value, category: c })}
              className={cn(
                "shrink-0 snap-start whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-200 ease-out",
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

      {/* Desktop / tablet: inline pills */}
      <div className="hidden flex-wrap gap-2 md:flex">
        <Select label="Grade" value={String(value.grade)} options={[["All","All"],["9","9th"],["10","10th"],["11","11th"],["12","12th"]]} onChange={(v) => onChange({ ...value, grade: v === "All" ? "All" : Number(v) })} />
        <Select label="Cost" value={value.cost} options={[["All","All"],["Free","Free"],["Paid","Fee-based"],["Stipend","Earns stipend"]]} onChange={(v) => onChange({ ...value, cost: v as FilterState["cost"] })} />
        <Select label="Format" value={value.format} options={[["All","All"],["In-person","In-person"],["Online","Online"],["Hybrid","Hybrid"]]} onChange={(v) => onChange({ ...value, format: v as FilterState["format"] })} />
      </div>

      {/* Mobile: single button opens bottom sheet */}
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="w-full justify-between rounded-full border-border bg-card px-5 py-6 text-base shadow-soft">
              <span className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </span>
              {activeCount > 0 && (
                <span className="rounded-full bg-coral px-2 py-0.5 text-xs font-semibold text-coral-foreground">{activeCount}</span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-3xl">
            <SheetHeader>
              <SheetTitle className="font-display text-2xl">Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-3">
              <SheetSelect label="Grade" value={String(value.grade)} options={[["All","All"],["9","9th"],["10","10th"],["11","11th"],["12","12th"]]} onChange={(v) => onChange({ ...value, grade: v === "All" ? "All" : Number(v) })} />
              <SheetSelect label="Cost" value={value.cost} options={[["All","All"],["Free","Free"],["Paid","Paid"],["Stipend","Stipend / Paid"]]} onChange={(v) => onChange({ ...value, cost: v as FilterState["cost"] })} />
              <SheetSelect label="Format" value={value.format} options={[["All","All"],["In-person","In-person"],["Online","Online"],["Hybrid","Hybrid"]]} onChange={(v) => onChange({ ...value, format: v as FilterState["format"] })} />
            </div>
            <SheetFooter className="mt-6 flex-row gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-full"
                onClick={() => onChange({ ...value, grade: "All", cost: "All", format: "All" })}
              >
                Reset
              </Button>
              <Button className="flex-1 rounded-full bg-ink text-cream hover:bg-ink/90" onClick={() => setOpen(false)}>
                Apply
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
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

function SheetSelect({ label, value, options, onChange }: { label: string; value: string; options: [string,string][]; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 rounded-2xl border border-border bg-card px-4 text-base font-semibold text-foreground outline-none focus:border-foreground"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
    </label>
  );
}