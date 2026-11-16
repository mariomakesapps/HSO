/**
 * Whether this visitor is on a phone-sized screen, data saver or a slow network.
 *
 * Used to skip background pre-loading of chunks that pull in the full opportunity
 * catalogue (several MB of JavaScript): on these devices that work froze the page
 * for about half a second right after it loaded, for something the visitor might
 * never open. The chunk still loads the moment it is actually needed.
 */
export function isConstrainedDevice(): boolean {
  if (typeof window === "undefined") return false;
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
    .connection;
  return (
    window.matchMedia?.("(max-width: 768px)").matches === true ||
    connection?.saveData === true ||
    /(^|-)2g|3g/.test(connection?.effectiveType ?? "")
  );
}
