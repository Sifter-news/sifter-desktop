-- Add avatar_url column to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT DEFAULT 'default-image.png';

-- Ensure investigations table has proper columns
ALTER TABLE public.investigations
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Re-enable RLS for these tables
ALTER TABLE public.investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Recreate the policies for investigations
CREATE POLICY "Enable read access for all users" ON public.investigations
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.investigations
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Enable update for investigation owners" ON public.investigations
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Enable delete for investigation owners" ON public.investigations
    FOR DELETE USING (auth.uid() = owner_id);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_avatar_url ON public.profiles(avatar_url);