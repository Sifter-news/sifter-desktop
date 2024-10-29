-- Create connections table
CREATE TABLE IF NOT EXISTS public.connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES public.node(id) ON DELETE CASCADE,
    target_id UUID REFERENCES public.node(id) ON DELETE CASCADE,
    source_point VARCHAR(50),
    target_point VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access for authenticated users
CREATE POLICY "Enable read access for authenticated users"
ON public.connections FOR SELECT
TO authenticated
USING (true);

-- Create policy to allow insert for authenticated users
CREATE POLICY "Enable insert for authenticated users"
ON public.connections FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create policy to allow update for authenticated users
CREATE POLICY "Enable update for authenticated users"
ON public.connections FOR UPDATE
TO authenticated
USING (true);

-- Create policy to allow delete for authenticated users
CREATE POLICY "Enable delete for authenticated users"
ON public.connections FOR DELETE
TO authenticated
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_connections_source ON public.connections(source_id);
CREATE INDEX idx_connections_target ON public.connections(target_id);