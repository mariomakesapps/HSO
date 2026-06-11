
-- 1) Restrict users table SELECT to self only
DROP POLICY IF EXISTS "Profiles are public" ON public.users;
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.users;
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);
REVOKE SELECT ON public.users FROM anon;

-- 2) Restrict shared_collections SELECT to owner only (legacy/unused publicly)
DROP POLICY IF EXISTS "Shared collections are public" ON public.shared_collections;
DROP POLICY IF EXISTS "Anyone can view shared collections" ON public.shared_collections;
DROP POLICY IF EXISTS "Public read shared_collections" ON public.shared_collections;
DROP POLICY IF EXISTS "Owners can view their shared_collections" ON public.shared_collections;
CREATE POLICY "Owners can view their shared_collections"
  ON public.shared_collections
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
REVOKE SELECT ON public.shared_collections FROM anon;
