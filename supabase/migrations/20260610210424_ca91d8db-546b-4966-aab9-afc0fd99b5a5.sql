CREATE OR REPLACE FUNCTION public.get_curated_collection_counts()
RETURNS TABLE(curated_id text, like_count bigint, save_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH l AS (
    SELECT curated_id, COUNT(*)::bigint AS c FROM public.curated_collection_likes GROUP BY curated_id
  ), s AS (
    SELECT curated_id, COUNT(*)::bigint AS c FROM public.curated_collection_saves GROUP BY curated_id
  )
  SELECT COALESCE(l.curated_id, s.curated_id) AS curated_id,
         COALESCE(l.c, 0) AS like_count,
         COALESCE(s.c, 0) AS save_count
  FROM l FULL OUTER JOIN s ON l.curated_id = s.curated_id;
$$;

GRANT EXECUTE ON FUNCTION public.get_curated_collection_counts() TO anon, authenticated;