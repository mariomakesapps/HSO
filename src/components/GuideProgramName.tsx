import { Link } from "react-router-dom";

/**
 * Guide programmes that have their own HSO listing. The guides compare programmes
 * by name; linking each name to its listing (with the name as the anchor text)
 * passes the guides' authority to those pages. A test checks every id still
 * exists in the catalogue.
 */
export const GUIDE_PROGRAM_LISTINGS: Record<string, string> = {
  "Stanford Institutes of Medicine Summer Research Program (SIMR)": "simr",
  "NIH Summer Internship Program (HS-SIP)": "nih-summer",
  "Rockefeller University Summer Science Research Program (SSRP)": "rockefeller-ssrp",
  "MIT Research Science Institute (RSI)": "rsi",
  "Regeneron Science Talent Search (STS)": "regeneron-sts",
  "Regeneron International Science and Engineering Fair (ISEF)": "isef",
  "Junior Science and Humanities Symposium (JSHS)": "jshs",
  "Davidson Fellows Scholarship": "davidson-fellows",
  "Conrad Challenge": "conrad-foundation-conrad-challenge",
};

/** Programme names whose text starts with these map to a listing too (long names). */
const PREFIX_LISTINGS: [string, string][] = [
  ["Wharton Global Youth Program (Leadership in the Business World", "wharton-school-leadership-in-the-business-world-lbw"],
  ["Georgetown Hoya Summer Law Academy", "syp-georgetown"],
];

export function listingForGuideProgram(name: string): string | undefined {
  return GUIDE_PROGRAM_LISTINGS[name] ?? PREFIX_LISTINGS.find(([p]) => name.startsWith(p))?.[1];
}

export function GuideProgramName({ name }: { name: string }) {
  const id = listingForGuideProgram(name);
  if (!id) return <>{name}</>;
  return (
    <Link to={`/opportunities/${id}`} className="underline decoration-coral/40 underline-offset-4 hover:text-coral">
      {name}
    </Link>
  );
}
