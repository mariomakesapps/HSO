import { allOpportunities, locationState, type Opportunity } from "@/data/opportunities";
import { curatedCollections, type CuratedCollection } from "@/data/curatedCollections";

/**
 * Facts about a collection derived from the opportunities it actually contains.
 *
 * The collection data declares its own `categories`, and those labels had
 * drifted from reality — 39 listings sat in a collection that did not claim
 * their category. That is not just cosmetic: the "Type" filter on the
 * collections page tested the declared label, so filtering by Summer Program
 * hid collections that were full of summer programs.
 *
 * Deriving these from the member listings means the label cannot be wrong, and
 * it stays correct as the catalog changes.
 */
export interface CollectionFacts {
  /** Members that still resolve to a live listing. */
  opportunities: Opportunity[];
  /** Categories genuinely represented, in catalog order. */
  categories: string[];
  /** US state buckets represented. */
  states: Set<string>;
  /** Whether anything inside is free or pays a stipend. */
  hasFree: boolean;
  /** A few recognisable names, for a preview on the card. */
  highlights: Opportunity[];
}

const byId = new Map(allOpportunities.map((o) => [o.id, o]));

function computeFacts(collection: CuratedCollection): CollectionFacts {
  const opportunities = collection.opportunityIds
    .map((id) => byId.get(id))
    .filter((o): o is Opportunity => !!o);

  const categories: string[] = [];
  const states = new Set<string>();
  let hasFree = false;

  for (const o of opportunities) {
    if (!categories.includes(o.category)) categories.push(o.category);
    states.add(locationState(o.location));
    if (o.cost === "Free" || o.cost === "Stipend") hasFree = true;
  }

  // Lead with the most reputable, since those are what make a collection
  // recognisable at a glance.
  const highlights = [...opportunities].sort((a, b) => b.prestige - a.prestige).slice(0, 3);

  return { opportunities, categories, states, hasFree, highlights };
}

const factsById = new Map<string, CollectionFacts>(
  curatedCollections.map((c) => [c.id, computeFacts(c)]),
);

export function collectionFacts(id: string): CollectionFacts {
  return (
    factsById.get(id) ?? {
      opportunities: [],
      categories: [],
      states: new Set<string>(),
      hasFree: false,
      highlights: [],
    }
  );
}

/** Every category actually represented across all collections. */
export const allCollectionCategories: string[] = Array.from(
  new Set(curatedCollections.flatMap((c) => collectionFacts(c.id).categories)),
).sort();

/** Every state bucket actually represented across all collections. */
export const allCollectionStates: string[] = Array.from(
  new Set(curatedCollections.flatMap((c) => Array.from(collectionFacts(c.id).states))),
).sort();
