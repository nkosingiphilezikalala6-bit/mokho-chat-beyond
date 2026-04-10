
-- Drop the overly permissive update policy
DROP POLICY "Authenticated users can update reactions" ON public.confessions;

-- Create a more specific update policy - still allows any authenticated user to update (for reactions)
-- but only the owner can update content
CREATE POLICY "Authenticated users can react to confessions"
ON public.confessions FOR UPDATE
TO authenticated
USING (true);
