
DO $$
DECLARE tbl record;
BEGIN
  FOR tbl IN SELECT c.relname AS table_name FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace WHERE c.relkind='r' AND n.nspname='public'
  LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', tbl.table_name);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', tbl.table_name);
  END LOOP;
END $$;

-- Public-readable tables: also grant SELECT to anon
GRANT SELECT ON public.collections TO anon;
GRANT SELECT ON public.collection_items TO anon;
GRANT SELECT ON public.collection_likes TO anon;
GRANT SELECT ON public.collection_comments TO anon;
GRANT SELECT ON public.users TO anon;
GRANT SELECT ON public.shared_collections TO anon;

-- Anonymous-writable tables per existing policies
GRANT INSERT ON public.contact_messages TO anon;
GRANT INSERT ON public.opportunity_submissions TO anon;
