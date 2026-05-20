-- Revoke direct API execute on helper/trigger functions; keep usable inside RLS/triggers via SECURITY DEFINER
REVOKE EXECUTE ON FUNCTION public.can_view_collection(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.can_edit_collection(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.set_updated_at() FROM anon, authenticated, public;

-- Share-link creation must require authentication
REVOKE EXECUTE ON FUNCTION public.create_collection_share_link(uuid, public.collection_permission, timestamptz) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.create_collection_share_link(uuid, public.collection_permission, timestamptz) TO authenticated;

-- Share-token lookup functions remain callable by anon (public share links)
GRANT EXECUTE ON FUNCTION public.get_collection_by_share_token(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_collection_items_by_share_token(text) TO anon, authenticated;

-- Tighten permissive INSERT policies with basic validation instead of WITH CHECK (true)
DROP POLICY IF EXISTS "Anyone can send contact messages" ON public.contact_messages;
CREATE POLICY "Anyone can send contact messages"
ON public.contact_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(email) BETWEEN 3 AND 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(message) BETWEEN 5 AND 2000
  AND length(reason) BETWEEN 1 AND 100
  AND (related_url IS NULL OR length(related_url) <= 500)
);

DROP POLICY IF EXISTS "Anyone can submit opportunities" ON public.opportunity_submissions;
CREATE POLICY "Anyone can submit opportunities"
ON public.opportunity_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(title) BETWEEN 1 AND 200
  AND length(org) BETWEEN 1 AND 200
  AND length(category) BETWEEN 1 AND 100
  AND length(url) BETWEEN 1 AND 1000
  AND length(description) BETWEEN 1 AND 5000
  AND length(submitter_email) BETWEEN 3 AND 255
  AND submitter_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND status = 'pending'
);
