
-- Remove public read on shared_collections (owner-only retained)
DROP POLICY IF EXISTS "Public can read shared collections" ON public.shared_collections;
REVOKE SELECT ON public.shared_collections FROM anon;

-- Remove blanket authenticated read on users
DROP POLICY IF EXISTS "Authenticated users can read profiles" ON public.users;

-- Tighten collection_comments UPDATE to prevent moving comments to other collections
DROP POLICY IF EXISTS "Users update own comments" ON public.collection_comments;
CREATE POLICY "Users update own comments"
ON public.collection_comments
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id AND public.can_view_collection(collection_id));

-- Block changing collection_id on comment rows
CREATE OR REPLACE FUNCTION public.prevent_comment_collection_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.collection_id IS DISTINCT FROM OLD.collection_id THEN
    NEW.collection_id := OLD.collection_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_comment_collection_change ON public.collection_comments;
CREATE TRIGGER prevent_comment_collection_change
BEFORE UPDATE ON public.collection_comments
FOR EACH ROW EXECUTE FUNCTION public.prevent_comment_collection_change();
