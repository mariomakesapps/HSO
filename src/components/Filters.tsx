import type { Category } from "@/data/opportunities";

/**
 * Core filter state for the catalog.
 *
 * Every dimension is a list, and an EMPTY list means "no constraint" — there is
 * no "All" sentinel. That keeps the predicate in filterSort.ts uniform
 * (`none selected || includes`) and means a student can stack choices: show me
 * Research *and* Internships, that are Online *or* Hybrid, for grades 11 and 12.
 *
 * This module is types-only. The filter UI lives in the Refine panel in
 * pages/Index.tsx, built from MultiFilterDropdown; an older single-select
 * <Filters> component used to live here but was never rendered, and keeping a
 * second, diverging filter UI around was a maintenance trap.
 */
export type Cost = "Free" | "Paid" | "Stipend";
export type Format = "In-person" | "Online" | "Hybrid";

export type FilterState = {
  query: string;
  categories: Category[];
  grades: number[];
  costs: Cost[];
  formats: Format[];
};

export const EMPTY_FILTERS: FilterState = {
  query: "",
  categories: [],
  grades: [],
  costs: [],
  formats: [],
};

export const COST_OPTIONS: { value: Cost; label: string }[] = [
  { value: "Free", label: "Free" },
  { value: "Paid", label: "Tuition" },
  { value: "Stipend", label: "Paid (pays you)" },
];

export const FORMAT_OPTIONS: { value: Format; label: string; hint: string }[] = [
  { value: "In-person", label: "In person", hint: "Attend on site" },
  { value: "Online", label: "Remote", hint: "Do it from anywhere" },
  { value: "Hybrid", label: "Hybrid", hint: "Mix of both" },
];

export const GRADE_OPTIONS: { value: string; label: string }[] = [
  { value: "9", label: "9th grade" },
  { value: "10", label: "10th grade" },
  { value: "11", label: "11th grade" },
  { value: "12", label: "12th grade" },
];
