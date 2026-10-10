/**
 * Year labels used in titles, computed from the date rather than typed in, so
 * they roll over on their own.
 *
 * The school application cycle turns over in July: from July 2026 to June 2027
 * students are applying for the 2026-27 cycle. Summer programs are named for the
 * summer students are applying to, which is next summer from August onward.
 */
export function schoolCycle(now = new Date()): string {
  const y = now.getUTCFullYear();
  const start = now.getUTCMonth() >= 6 ? y : y - 1;
  return `${start}-${String((start + 1) % 100).padStart(2, "0")}`;
}

export function upcomingSummer(now = new Date()): number {
  const y = now.getUTCFullYear();
  return now.getUTCMonth() >= 7 ? y + 1 : y;
}
