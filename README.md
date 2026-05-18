# HSO

High School Opportunity is a Vite/React app backed by Supabase.

## Supabase collections backend

The production Collections system is defined in:

`supabase/migrations/20260513032000_collections_backend.sql`

Apply the migrations to the Supabase project before publishing:

```bash
supabase db push
```

The migration adds Supabase Auth profile rows, cloud collections, collection items,
specific-person shares, share links, saved opportunities, likes, bookmarks, comments,
RLS policies, and share-token RPCs.

Collections are stored in Supabase Postgres, not localStorage.
