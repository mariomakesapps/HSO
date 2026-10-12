import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Drawer, DrawerContent, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "./Button";
import { FilterPanel, type FilterPanelProps } from "./FilterPanel";

/**
 * Phones: the filter column becomes a bottom sheet behind a "Filters" button.
 * Filters apply as they change; the footer button shows the live result count
 * and closes the sheet.
 */
export function MobileFilters({ resultCount, ...panel }: FilterPanelProps & { resultCount: number }) {
  const [open, setOpen] = useState(false);
  const f = panel.filters;
  const e = panel.extra;
  const active = f.categories.length + f.grades.length + f.costs.length + f.formats.length + e.states.length + e.statuses.length;
  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
      <DrawerTrigger asChild>
        <Button variant="secondary" className="w-full sm:w-auto">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filters{active ? ` (${active})` : ""}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="hso-ds font-hso max-h-[88vh] rounded-t-[12px] border-hso-line bg-hso-surface">
        <DrawerTitle className="sr-only">Filters</DrawerTitle>
        <div className="overflow-y-auto px-4 pb-2 pt-2">
          <FilterPanel {...panel} />
        </div>
        <div className="border-t border-hso-line p-3">
          <Button className="w-full" onClick={() => setOpen(false)}>
            Show {resultCount.toLocaleString("en-US")} {resultCount === 1 ? "result" : "results"}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
