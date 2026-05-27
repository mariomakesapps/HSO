
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'collections','collection_items','collection_links','collection_likes',
    'collection_bookmarks','collection_shares','collection_comments',
    'saved_opportunities','shared_collections','reminder_preferences'
  ] LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
  END LOOP;
END$$;

-- Public-readable tables also need anon SELECT
GRANT SELECT ON public.collections TO anon;
GRANT SELECT ON public.collection_items TO anon;
GRANT SELECT ON public.collection_likes TO anon;
GRANT SELECT ON public.collection_comments TO anon;
GRANT SELECT ON public.shared_collections TO anon;
GRANT SELECT ON public.users TO anon;

GRANT SELECT, UPDATE ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;
