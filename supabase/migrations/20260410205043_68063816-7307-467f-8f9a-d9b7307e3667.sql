
-- Create confessions table for anonymous posts
CREATE TABLE public.confessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT 'purple',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reactions JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Enable RLS
ALTER TABLE public.confessions ENABLE ROW LEVEL SECURITY;

-- Anyone can view confessions (anonymous)
CREATE POLICY "Anyone can view confessions"
ON public.confessions FOR SELECT
USING (true);

-- Authenticated users can create confessions
CREATE POLICY "Authenticated users can create confessions"
ON public.confessions FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own confessions
CREATE POLICY "Users can delete own confessions"
ON public.confessions FOR DELETE
USING (auth.uid() = user_id);

-- Anyone authenticated can update reactions
CREATE POLICY "Authenticated users can update reactions"
ON public.confessions FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.confessions;
