DROP POLICY IF EXISTS "Profiles are public" ON public.users;

CREATE POLICY "Authenticated users can read profiles"
ON public.users
FOR SELECT
TO authenticated
USING (true);

REVOKE SELECT ON public.users FROM anon;