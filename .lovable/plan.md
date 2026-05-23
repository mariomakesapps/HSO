## Problem

Opening `/collections` throws `permission denied for function can_view_collection`. The RLS policies on `collections`, `collection_items`, `collection_likes`, `collection_comments`, and `collection_bookmarks` call `public.can_view_collection(...)` and `public.can_edit_collection(...)`, but the `anon` and `authenticated` Postgres roles were never granted EXECUTE on those `SECURITY DEFINER` functions, so every SELECT/INSERT against those tables fails.

## Fix

One small migration that grants execute permission on the two helper functions to the API roles:

```sql
GRANT EXECUTE ON FUNCTION public.can_view_collection(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.can_edit_collection(uuid) TO anon, authenticated;
```

Since both functions are `SECURITY DEFINER` with `SET search_path = public`, they remain safe to expose — they only return a boolean about whether the calling `auth.uid()` can see/edit a given collection.

## Verification

After applying, reload `/collections` — the toast should no longer appear and the page should load collections normally.
