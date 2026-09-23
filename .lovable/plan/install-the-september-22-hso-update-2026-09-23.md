# Install the September 22 HSO update

## Scope
- Replace the catalogue update data with the uploaded September 22 reviewed dataset.
- Add the new `/deadlines` page, including deadline grouping, opening dates, navigation links, metadata, sitemap support, and automated tests.
- Apply the local-time deadline fix so opportunities remain open through the end of their stated deadline day.

## Preserve current site changes
- Keep the navigation and page wording as **HSO Internships (unpaid)** rather than reverting to Volunteer.
- Keep the current padded browser and phone icons.
- Keep current form delivery and security fixes.
- Keep agent integrations removed, even though the uploaded archive contains older integration files.
- Do not overwrite generated backend client files, environment settings, or project configuration.

## Verification
- Run the relevant tests and type checks.
- Confirm the homepage, Deadlines page, and HSO Internships page load correctly on desktop and mobile.
- Confirm the catalogue count and sitemap reflect the updated reviewed listings.
