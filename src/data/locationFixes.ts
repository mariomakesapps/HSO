/**
 * Location strings corrected to the catalogue's normal "City, State, USA" shape.
 *
 * 77 listings stored only a city ("Cambridge, USA"). locationState() coped, because it
 * carries a hardcoded city-to-state map — but the raw string is what a visitor reads and
 * what lands in the page's meta description, and a city missing from that map silently
 * falls through to "Other".
 *
 * Every expansion here was taken from that same map, so no new claim is made about which
 * state a city is in. The handful of malformed strings that no map can fix are marked
 * "hand-corrected" and were each checked against the listing.
 *
 * Keyed by the exact old string, so one entry fixes every listing that shares it.
 */
export const LOCATION_FIXES: Record<string, string> = {
  // city map: amherst -> Massachusetts
  "Amherst, USA": "Amherst, Massachusetts, USA",
  // city map: ann arbor -> Michigan
  "Ann Arbor, USA": "Ann Arbor, Michigan, USA",
  // city map: aspen -> Colorado
  "Aspen, USA": "Aspen, Colorado, USA",
  // city map: atlanta -> Georgia
  "Atlanta, USA": "Atlanta, Georgia, USA",
  // city map: austin -> Texas
  "Austin, USA": "Austin, Texas, USA",
  // city map: baltimore -> Maryland
  "Baltimore, USA": "Baltimore, Maryland, USA",
  // city map: berkeley -> California
  "Berkeley, USA": "Berkeley, California, USA",
  // city map: bethesda -> Maryland
  "Bethesda, USA": "Bethesda, Maryland, USA",
  // city map: boston -> Massachusetts
  "Boston, USA": "Boston, Massachusetts, USA",
  // city map: staten island -> New York
  "Bronx / Manhattan / Staten Island, USA": "Bronx / Manhattan / Staten Island, New York, USA",
  // city map: bronx -> New York
  "Bronx, USA": "Bronx, New York, USA",
  // city map: brooklyn -> New York
  "Brooklyn, USA": "Brooklyn, New York, USA",
  // city map: cambridge -> Massachusetts
  "Cambridge, USA": "Cambridge, Massachusetts, USA",
  // city map: chicago -> Illinois
  "Chicago, USA": "Chicago, Illinois, USA",
  // city map: fairfax -> Virginia
  "Fairfax, USA": "Fairfax, Virginia, USA",
  // city map: gambier -> Ohio
  "Gambier, USA": "Gambier, Ohio, USA",
  // city map: harlem -> New York
  "Harlem, USA": "Harlem, New York, USA",
  // city map: interlochen -> Michigan
  "Interlochen, USA": "Interlochen, Michigan, USA",
  // city map: ithaca -> New York
  "Ithaca, USA": "Ithaca, New York, USA",
  // city map: lemont -> Illinois
  "Lemont, USA": "Lemont, Illinois, USA",
  // city map: lenox -> Massachusetts
  "Lenox, USA": "Lenox, Massachusetts, USA",
  // city map: los angeles -> California
  "Los Angeles, USA": "Los Angeles, California, USA",
  // city map: manhattan -> New York
  "Manhattan / Bronx, USA": "Manhattan / Bronx, New York, USA",
  // city map: manhattan -> New York
  "Manhattan, USA": "Manhattan, New York, USA",
  // city map: natick -> Massachusetts
  "Natick, USA": "Natick, Massachusetts, USA",
  // city map: new haven -> Connecticut
  "New Haven, USA": "New Haven, Connecticut, USA",
  // city map: oak ridge -> Tennessee
  "Oak Ridge, USA": "Oak Ridge, Tennessee, USA",
  // hand-corrected
  "Paris / Online": "Worldwide",
  // city map: philadelphia -> Pennsylvania
  "Philadelphia, USA": "Philadelphia, Pennsylvania, USA",
  // city map: portland -> Oregon
  "Portland, USA": "Portland, Oregon, USA",
  // city map: princeton -> New Jersey
  "Princeton, USA": "Princeton, New Jersey, USA",
  // city map: providence -> Rhode Island
  "Providence, USA": "Providence, Rhode Island, USA",
  // city map: queens -> New York
  "Queens, USA": "Queens, New York, USA",
  // city map: south bend -> Indiana
  "South Bend, USA": "South Bend, Indiana, USA",
  // city map: stanford -> California
  "Stanford, USA": "Stanford, California, USA",
  // hand-corrected
  "USA (NYC, Oakland, Detroit)": "Multiple, USA",
  // hand-corrected
  "USA / Online": "Online, USA",
  // hand-corrected
  "USA / multiple": "Multiple, USA",
  // city map: upton -> New York
  "Upton, USA": "Upton, New York, USA",
  // hand-corrected
  "Western States, USA": "Multiple, USA",
  // hand-corrected
  "Worldwide (Online)": "Worldwide",
};
