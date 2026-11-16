# Project architecture rules

- Keep form recipient routing in a shared server-only module used by send functions and fixed-recipient templates so delivery and logs cannot diverge.

- Apply shared catalogue hygiene and location normalization before exposing `allOpportunities`, so cards, filters, metadata, structured data, and generated SEO files always use identical corrected records.
- Apply dated partial catalogue updates chronologically before shared hygiene, and use the newest supplied listing SEO override in shared page metadata; this preserves earlier corrections and keeps runtime and generated pages consistent.
- Determine geographic eligibility from listing content, not country words in official URLs; worldwide online opportunities may use foreign domains while remaining available to U.S. students.
- Production client builds replace `@/data/opportunities` and `@/data/listingDates` with precompiled JSON from the same pipeline (`hso-precompiled-catalogue` in `vite.config.ts`). Keep the client-side helpers in `src/data/opportunityModel.ts` and `src/data/listingDatesModel.ts` free of catalogue data imports, and have client code import only `allOpportunities`, the types and those helpers from `@/data/opportunities`.
