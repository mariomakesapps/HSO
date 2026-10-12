export type DeadlineStatus = "open" | "closing-soon" | "closed" | "rolling" | "opens-later";

/**
 * Parse a catalogue date in the reader's own timezone.
 *
 * new Date("2026-09-20") is midnight UTC, which is the evening of the 19th
 * across the Americas — so a listing closing today was labelled "Closed" a day
 * early for every US visitor. A deadline runs to the end of its day and an
 * opening date starts at the beginning of its day, both local.
 */
function parseDay(iso: string, edge: "start" | "end"): number {
  return new Date(`${iso}T${edge === "end" ? "23:59:59" : "00:00:00"}`).getTime();
}

export function getDeadlineStatus(deadline: string | null | undefined, opensAt?: string | null): {
  status: DeadlineStatus;
  label: string;
  daysLeft: number | null;
} {
  const now = Date.now();
  const opensTime = opensAt ? parseDay(opensAt, "start") : NaN;
  if (!Number.isNaN(opensTime) && opensTime > now) {
    const daysUntilOpen = Math.ceil((opensTime - now) / 86400000);
    return { status: "opens-later", label: `Opens in ${daysUntilOpen}d`, daysLeft: daysUntilOpen };
  }

  if (!deadline) return { status: "rolling", label: "Deadline TBA", daysLeft: null };
  const deadlineTime = parseDay(deadline, "end");
  if (Number.isNaN(deadlineTime)) return { status: "rolling", label: "Deadline TBA", daysLeft: null };

  const days = Math.ceil((deadlineTime - now) / 86400000);
  if (days <= 0) return { status: "closed", label: "Closed for this cycle", daysLeft: days };
  if (days <= 30) return { status: "closing-soon", label: `Closing soon - ${days}d`, daysLeft: days };
  return { status: "open", label: `Open - ${days}d left`, daysLeft: days };
}

export const STATUS_STYLES: Record<DeadlineStatus, string> = {
  open: "bg-sage/20 text-sage-foreground border border-sage/40",
  "closing-soon": "bg-coral/15 text-coral border border-coral/40",
  closed: "bg-foreground/10 text-foreground/60 border border-foreground/20",
  rolling: "bg-ochre/20 text-ochre-foreground border border-ochre/40",
  "opens-later": "bg-sky/20 text-ink border border-sky/40",
};
