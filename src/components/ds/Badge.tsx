import type { ReactNode } from "react";
import { Clock } from "lucide-react";
import type { Opportunity } from "@/data/opportunities";
import { getDeadlineStatus } from "@/lib/deadline";
import { cn } from "@/lib/utils";

export type BadgeTone = "good" | "neutral" | "urgent";

const TONES: Record<BadgeTone, string> = {
  good: "bg-hso-green-tint text-hso-green-strong",
  neutral: "bg-hso-neutral-tint text-hso-muted",
  urgent: "bg-hso-coral-tint text-hso-coral-strong",
};

/** Small square-cornered label. Green only for good status (Free, Paid, Open). */
export function Badge({ tone = "neutral", children, className }: { tone?: BadgeTone; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-hso-sm px-2 py-0.5 text-xs font-medium", TONES[tone], className)}>
      {children}
    </span>
  );
}

/**
 * Cost in the words a student means. The data's "Stipend" is money paid TO the
 * student, shown as "Paid"; the data's "Paid" means the student pays, shown as
 * "Tuition" so the two never read the same.
 */
export function CostBadge({ cost }: { cost: Opportunity["cost"] }) {
  if (cost === "Free") return <Badge tone="good">Free</Badge>;
  if (cost === "Stipend") return <Badge tone="good">Paid</Badge>;
  return <Badge>Tuition</Badge>;
}

export function GradesBadge({ grades }: { grades: number[] }) {
  if (!grades.length) return null;
  const lo = Math.min(...grades);
  const hi = Math.max(...grades);
  return <Badge>{lo === hi ? `Grade ${lo}` : `Grades ${lo}-${hi}`}</Badge>;
}

/**
 * Deadline as a countdown. Two weeks or less is urgent (coral), further out is
 * open (green), anything without a date is neutral. The label depends on today's
 * date, which can differ between the build and the visit, so its text is exempt
 * from the hydration check.
 */
export function DeadlineChip({ deadline, opensAt }: { deadline: string | null; opensAt?: string | null }) {
  const dl = getDeadlineStatus(deadline, opensAt);
  let tone: BadgeTone = "neutral";
  let label = "Deadline TBA";
  if (dl.status === "closed") label = "Closed for this cycle";
  else if (dl.status === "opens-later") label = dl.daysLeft === 1 ? "Opens tomorrow" : `Opens in ${dl.daysLeft} days`;
  else if (dl.daysLeft !== null) {
    tone = dl.daysLeft <= 14 ? "urgent" : "good";
    label = dl.daysLeft === 1 ? "Last day" : `${dl.daysLeft} days left`;
  }
  return (
    <Badge tone={tone}>
      <Clock className="h-3 w-3" aria-hidden="true" />
      <span suppressHydrationWarning>{label}</span>
    </Badge>
  );
}
