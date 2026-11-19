# High School Opportunity (HSO)

**Live site** https://highschoolopportunity.org

High School Opportunity is a free website that helps high school students find internships, scholarships, summer programs, competitions, and other opportunities in one place.

I started HSO because a lot of students at underrepresented schools never hear about these programs. The good ones are spread across hundreds of sites, and deadlines are easy to miss. HSO puts them in one searchable place, keeps the deadlines up to date, and lets students save and share lists with friends.

Built by Mario Meraja and Tahmidul Goffar for the 2026 Congressional App Challenge.

## What it does

- **Browse and search** opportunities by category (STEM, medicine, law, business, arts, and more), by location (NYC, remote, nationwide), and by deadline
- **Opportunity pages** with eligibility, cost, dates, and a direct link to apply
- **Deadlines page** that shows what is closing soon
- **Collections** so students can save opportunities into lists and share them with a link
- **Accounts** with saved opportunities, likes, bookmarks, and comments
- **Guides** like top medical internships and top research competitions
- **Submit form** so anyone can suggest a new opportunity
- **Volunteer page** for students who want to help run HSO

## Tech stack

- React + TypeScript + Vite
- Tailwind CSS and shadcn/ui
- Supabase (Postgres, Auth, Row Level Security, Edge Functions)
- Vitest for tests
- Deployed on Vercel

## Run it locally

You need Node.js 18 or newer.

```bash
git clone https://github.com/mariomakesapps/HSO.git
cd HSO
npm install
npm run dev
```

Then open http://localhost:8080 (Vite prints the exact URL in the terminal).

The repo includes a `.env` with the public Supabase URL and publishable (anon) key, so the app works out of the box against the live database. These keys are meant to be public and are protected by Row Level Security. To use your own Supabase project instead, replace the values in `.env`

```
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
```

and apply the database migrations

```bash
supabase db push
```

## Other commands

```bash
npm run build      # production build (also prerenders SEO pages and the sitemap)
npm run preview    # preview the production build
npm test           # run the test suite
npm run lint       # lint
```

## Project structure

```
src/pages/        page components (home, categories, deadlines, collections, guides...)
src/components/   shared UI
src/data/         opportunity data and data cleanup
src/integrations/ Supabase client
supabase/         database migrations and edge functions
scripts/          link checking and SEO scripts
```

## Collections backend

Collections are stored in Supabase Postgres, not localStorage. The main schema is in `supabase/migrations/20260513032000_collections_backend.sql`. It adds profile rows, collections, collection items, share links, saved opportunities, likes, bookmarks, comments, RLS policies, and share token RPCs.

## License

MIT
