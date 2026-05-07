export type DeadlineStatus = "open" | "closing-soon" | "closed" | "rolling";

export function getDeadlineStatus(deadline: string | null | undefined): {
  status: DeadlineStatus;
  label: string;
  daysLeft: number | null;
} {
  if (!deadline) return { status: "rolling", label: "Rolling", daysLeft: null };
  const t = new Date(deadline).getTime();
  if (Number.isNaN(t)) return { status: "rolling", label: "Rolling", daysLeft: null };
  const days = Math.ceil((t - Date.now()) / 86400000);
  if (days <= 0) return { status: "closed", label: "Closed", daysLeft: days };
  if (days <= 30) return { status: "closing-soon", label: `Closing soon · ${days}d`, daysLeft: days };
  return { status: "open", label: `Open · ${days}d left`, daysLeft: days };
}

export const STATUS_STYLES: Record<DeadlineStatus, string> = {
  open: "bg-sage/20 text-sage-foreground border border-sage/40",
  "closing-soon": "bg-coral/15 text-coral border border-coral/40",
  closed: "bg-foreground/10 text-foreground/60 border border-foreground/20",
  rolling: "bg-ochre/20 text-ochre-foreground border border-ochre/40",
};