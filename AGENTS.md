# Project architecture rules

- Apply shared catalogue hygiene and location normalization before exposing `allOpportunities`, so cards, filters, metadata, structured data, and generated SEO files always use identical corrected records.
- Apply dated partial catalogue updates chronologically before shared hygiene, and use the newest supplied listing SEO override in shared page metadata; this preserves earlier corrections and keeps runtime and generated pages consistent.
- Determine geographic eligibility from listing content, not country words in official URLs; worldwide online opportunities may use foreign domains while remaining available to U.S. students.
