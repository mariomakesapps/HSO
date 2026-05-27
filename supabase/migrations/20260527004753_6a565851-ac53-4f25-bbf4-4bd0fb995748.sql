
-- Lock down legacy user-created collections so normal users cannot create/edit/delete them anymore.
DROP POLICY IF EXISTS "Owners insert own collections" ON public.collections;
DROP POLICY IF EXISTS "Owners delete own collections" ON public.collections;
DROP POLICY IF EXISTS "Owners and editors update collections" ON public.collections;

-- Curated saves (per-user bookmark of a curated collection).
CREATE TABLE IF NOT EXISTS public.curated_collection_saves (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  curated_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, curated_id)
);

GRANT SELECT, INSERT, DELETE ON public.curated_collection_saves TO authenticated;
GRANT ALL ON public.curated_collection_saves TO service_role;

ALTER TABLE public.curated_collection_saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own curated saves"
ON public.curated_collection_saves FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users add own curated saves"
ON public.curated_collection_saves FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users remove own curated saves"
ON public.curated_collection_saves FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- Curated likes (per-user like of a curated collection).
CREATE TABLE IF NOT EXISTS public.curated_collection_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  curated_id text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, curated_id)
);

GRANT SELECT, INSERT, DELETE ON public.curated_collection_likes TO authenticated;
GRANT ALL ON public.curated_collection_likes TO service_role;

ALTER TABLE public.curated_collection_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own curated likes"
ON public.curated_collection_likes FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users add own curated likes"
ON public.curated_collection_likes FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users remove own curated likes"
ON public.curated_collection_likes FOR DELETE TO authenticated
USING (auth.uid() = user_id);
