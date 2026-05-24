-- Attach the existing safeguard trigger so role changes via self-update are reverted
DROP TRIGGER IF EXISTS prevent_user_role_self_update_trg ON public.users;
CREATE TRIGGER prevent_user_role_self_update_trg
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.prevent_user_role_self_update();

-- Tighten the RLS UPDATE policy to also reject role changes at the policy level
DROP POLICY IF EXISTS "Users update own profile" ON public.users;
CREATE POLICY "Users update own profile"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND role = (SELECT u.role FROM public.users u WHERE u.id = auth.uid())
);