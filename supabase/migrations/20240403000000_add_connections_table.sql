-- Drop existing table if it exists
DROP TABLE IF EXISTS public.connections;

-- Create connections table
CREATE TABLE public.connections (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    source_id uuid REFERENCES public.node(id) ON DELETE CASCADE,
    target_id uuid REFERENCES public.node(id) ON DELETE CASCADE,
    source_point text,
    target_point text
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS connections_source_id_idx ON public.connections(source_id);
CREATE INDEX IF NOT EXISTS connections_target_id_idx ON public.connections(target_id);

-- Enable RLS
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for all users" ON public.connections
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.connections
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.connections
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users" ON public.connections
    FOR DELETE USING (auth.role() = 'authenticated');