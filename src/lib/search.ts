import type { Opportunity } from "@/data/opportunities";
import { locationStates } from "@/data/locations";

/**
 * Free-text search over the catalogue.
 *
 * The query used to be matched as one exact phrase, so "new york research" and
 * "scholarship seniors" found nothing, and "mit" matched "submit" and "limit".
 * Now every word of the query must appear (in any order) at the start of a word
 * in the listing, and a few words students type are matched to the words
 * listings use ("medical" also finds "medicine", "cs" finds "computer science").
 */

const STOPWORDS = new Set([
  "a", "an", "and", "the", "for", "of", "in", "on", "to", "at", "with", "or",
  "high", "school", "student", "students", "hs", "program", "programs", "opportunity", "opportunities",
]);

/** Each group is interchangeable: a query word from a group matches any word in it. */
const SYNONYMS: string[][] = [
  ["medical", "medicine", "health", "healthcare", "clinical", "hospital", "pre-med", "premed"],
  ["cs", "computer science", "coding", "programming", "software"],
  ["ai", "artificial intelligence", "machine learning"],
  ["math", "mathematics"],
  ["bio", "biology"],
  ["chem", "chemistry"],
  ["engineering", "engineer"],
  ["remote", "online", "virtual"],
  ["paid", "stipend", "wage"],
  ["contest", "competition", "challenge", "olympiad"],
  ["camp", "summer program", "summer"],
  ["nyc", "new york"],
  ["dc", "district of columbia", "washington dc"],
  ["la", "los angeles"],
  ["sf", "san francisco"],
  ["writing", "writer", "essay", "poetry"],
  ["art", "arts"],
  ["law", "legal"],
  ["business", "entrepreneurship", "finance"],
  ["environment", "environmental", "climate", "sustainability"],
];

const GRADE_WORDS: Record<string, number> = {
  freshman: 9, freshmen: 9, sophomore: 10, sophomores: 10, junior: 11, juniors: 11, senior: 12, seniors: 12,
  "9th": 9, "10th": 10, "11th": 11, "12th": 12,
};

const COST_WORDS: Record<Opportunity["cost"], string> = {
  Free: "free",
  Stipend: "paid stipend",
  Paid: "tuition fee",
};

const FORMAT_WORDS: Record<Opportunity["format"], string> = {
  Online: "online remote virtual",
  Hybrid: "hybrid online in-person",
  "In-person": "in-person in person",
};

const textCache = new Map<string, string>();

function normalise(s: string): string {
  return s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9+#.-]+/g, " ").trim();
}

/** Everything a listing can be found by, lowercased, with word boundaries kept. */
function searchText(o: Opportunity): string {
  const cached = textCache.get(o.id);
  if (cached !== undefined) return cached;
  const text = ` ${normalise(
    [
      o.title, o.org, o.location, o.blurb, o.category, ...o.fields,
      COST_WORDS[o.cost], FORMAT_WORDS[o.format], ...locationStates(o.location),
    ].join(" "),
  )} `;
  textCache.set(o.id, text);
  return text;
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * A query word matches at the start of a word: "math" finds "mathematics", not
 * "aftermath". Words of three letters or fewer must match a whole word, so "mit"
 * does not find "submit" and "la" does not find "lab".
 */
function wordPattern(word: string): string {
  const end = word.length <= 3 ? "(?=$|[^a-z0-9])" : "";
  return `(?:^|[^a-z0-9])${escape(word)}${end}`;
}

type Term = { patterns: RegExp[]; grade?: number };

let lastQuery = "";
let lastTerms: Term[] = [];

function compile(query: string): Term[] {
  if (query === lastQuery) return lastTerms;
  const words = normalise(query).split(/\s+/).filter(Boolean);
  const terms: Term[] = [];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    // Two-word synonyms the student typed as two words ("computer science", "new york").
    const pair = i + 1 < words.length ? `${word} ${words[i + 1]}` : "";
    const pairGroup = pair ? SYNONYMS.find((g) => g.includes(pair)) : undefined;
    if (pairGroup) {
      terms.push({ patterns: pairGroup.map((w) => new RegExp(wordPattern(w))) });
      i++;
      continue;
    }
    if (STOPWORDS.has(word)) continue;
    const grade = GRADE_WORDS[word];
    // Plurals: "internships" should still find "internship".
    const stem = word.length > 4 && word.endsWith("s") && !word.endsWith("ss") ? word.slice(0, -1) : word;
    const group = SYNONYMS.find((g) => g.includes(word) || g.includes(stem));
    const variants = new Set([stem, ...(group ?? [])]);
    terms.push({ patterns: [...variants].map((w) => new RegExp(wordPattern(w))), grade });
  }
  lastQuery = query;
  lastTerms = terms;
  return terms;
}

/** True when every word of the query matches the listing. An empty query matches everything. */
export function matchesQuery(o: Opportunity, query: string): boolean {
  const terms = compile(query);
  if (!terms.length) return true;
  const text = searchText(o);
  return terms.every((t) =>
    t.grade !== undefined ? o.grades.includes(t.grade) || t.patterns.some((p) => p.test(text)) : t.patterns.some((p) => p.test(text)),
  );
}
