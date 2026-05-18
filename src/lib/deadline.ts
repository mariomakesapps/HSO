export type DeadlineStatus = "open" | "closing-soon" | "closed" | "rolling" | "opens-later";

export function getDeadlineStatus(deadline: string | null | undefined, opensAt?: string | null): {
  status: DeadlineStatus;
  label: string;
  daysLeft: number | null;
} {
  const now = Date.now();
  const opensTime = opensAt ? new Date(opensAt).getTime() : NaN;
  if (!Number.isNaN(opensTime) && opensTime > now) {
    const daysUntilOpen = Math.ceil((opensTime - now) / 86400000);
    return { status: "opens-later", label: `Opens in ${daysUntilOpen}d`, daysLeft: daysUntilOpen };
  }

  if (!deadline) return { status: "rolling", label: "Deadline TBA", daysLeft: null };
  const deadlineTime = new Date(deadline).getTime();
  if (Number.isNaN(deadlineTime)) return { status: "rolling", label: "Deadline TBA", daysLeft: null };

  const days = Math.ceil((deadlineTime - now) / 86400000);
  if (days <= 0) return { status: "closed", label: "Closed", daysLeft: days };
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
