import { useState, useMemo, useRef, useEffect } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type DropdownOption = { value: string; label: string };

/**
 * Multi-select sibling of FilterDropdown.
 *
 * An empty selection means "no constraint" rather than a magic "All" value, so
 * the filter predicate stays a plain `selected.length === 0 || selected.includes(x)`
 * and there is no sentinel to accidentally leak into a URL or a chip label.
 *
 * The menu stays open while options are toggled — picking three fields should
 * not mean reopening the menu three times.
 */
export function MultiFilterDropdown({
  label,
  selected,
  options,
  onChange,
  searchable = false,
  searchPlaceholder = "Search...",
  allLabel = "All",
  counts,
  hideEmpty = false,
  className,
  align = "start",
  fullWidth = false,
}: {
  label: string;
  selected: string[];
  options: DropdownOption[];
  onChange: (v: string[]) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  allLabel?: string;
  /** Result count per option value; options with 0 are dead ends. */
  counts?: Record<string, number>;
  hideEmpty?: boolean;
  className?: string;
  align?: "start" | "center" | "end";
  fullWidth?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    let list = options;
    if (hideEmpty && counts) {
      // Keep anything already selected so a choice never vanishes under the cursor.
      list = list.filter((o) => (counts[o.value] ?? 0) > 0 || selected.includes(o.value));
    }
    if (!searchable || !query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query, searchable, counts, hideEmpty, selected]);

  useEffect(() => {
    if (open && searchable) {
      const t = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(t);
    }
    if (!open) setQuery("");
  }, [open, searchable]);

  const toggle = (value: string) => {
    onChange(
      selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value],
    );
  };

  // "Cost / Free +2" reads better than a truncated list of every choice.
  const summary = useMemo(() => {
    if (selected.length === 0) return allLabel;
    const first = options.find((o) => o.value === selected[0])?.label ?? selected[0];
    return selected.length === 1 ? first : `${first} +${selected.length - 1}`;
  }, [selected, options, allLabel]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "group inline-flex h-11 min-w-0 items-center gap-2 rounded-full border bg-card/90 px-4 text-sm font-medium shadow-soft transition-[transform,border-color,background-color] hover:-translate-y-0.5 hover:border-ink/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/40 active:translate-y-0 sm:h-10",
            selected.length > 0 ? "border-coral/45 bg-coral/5" : "border-border/80",
            fullWidth && "w-full justify-between",
            className,
          )}
          aria-expanded={open}
          aria-label={`${label} filter, ${selected.length > 0 ? `${selected.length} selected` : "none selected"}`}
        >
          <span className="truncate">
            <span className="text-muted-foreground">{label} / </span>
            <span className="font-semibold text-ink">{summary}</span>
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align={align}
        sideOffset={6}
        className="w-[var(--radix-popover-trigger-width)] min-w-[230px] max-w-[340px] rounded-2xl border-border/70 bg-cream/96 p-0 text-ink shadow-editorial backdrop-blur-md"
      >
        {searchable && (
          <div className="border-b border-border/60 p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-9 w-full rounded-lg border border-border/60 bg-background pl-8 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-coral/60"
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-b border-border/60 px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {selected.length > 0 ? `${selected.length} selected` : "Select any"}
          </span>
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => onChange([])}
              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold text-coral hover:bg-coral/10"
            >
              <X className="h-3 w-3" />
              Clear
            </button>
          )}
        </div>

        <div
          className="hso-scroll max-h-[60vh] overflow-y-auto overscroll-contain p-1 sm:max-h-[300px]"
          style={{ WebkitOverflowScrolling: "touch", touchAction: "pan-y" }}
          onTouchMove={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
        >
          {filtered.length === 0 ? (
            <p className="px-3 py-6 text-center text-xs text-muted-foreground">No matches.</p>
          ) : (
            filtered.map((o) => {
              const active = selected.includes(o.value);
              return (
                <button
                  key={o.value}
                  type="button"
                  role="checkbox"
                  aria-checked={active}
                  onClick={() => toggle(o.value)}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors",
                    active ? "bg-coral/10 font-semibold text-ink" : "text-foreground hover:bg-ink/5",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                      active ? "border-coral bg-coral text-cream" : "border-border bg-background",
                    )}
                  >
                    {active && <Check className="h-3 w-3" />}
                  </span>
                  <span className="truncate">{o.label}</span>
                  {counts && (
                    <span className="ml-auto shrink-0 text-xs tabular-nums text-muted-foreground">
                      {counts[o.value] ?? 0}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
