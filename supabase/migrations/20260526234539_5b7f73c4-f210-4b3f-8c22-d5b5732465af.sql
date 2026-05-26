-- Make collections RLS bulletproof for owners while preserving public/link visibility.
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.collections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.collections TO authenticated;
GRANT ALL ON public.collections TO service_role;

DROP POLICY IF EXISTS "Users create own collections" ON public.collections;
DROP POLICY IF EXISTS "Only owners delete collections" ON public.collections;
DROP POLICY IF EXISTS "Owners and editors update collections" ON public.collections;
DROP POLICY IF EXISTS "Collections are visible to allowed users" ON public.collections;

CREATE POLICY "Owners insert own collections"
  ON public.collections
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners delete own collections"
  ON public.collections
  FOR DELETE
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners and editors update collections"
  ON public.collections
  FOR UPDATE
  TO authenticated
  USING (public.can_edit_collection(id))
  WITH CHECK (public.can_edit_collection(id));

CREATE POLICY "Collections visible to allowed viewers"
  ON public.collections
  FOR SELECT
  TO anon, authenticated
  USING (public.can_view_collection(id));
