-- Create nodes table
CREATE TABLE IF NOT EXISTS public.node (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    owner_id UUID REFERENCES auth.users(id),
    investigation_id UUID REFERENCES public.investigation(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.node ENABLE ROW LEVEL SECURITY;

-- Create policies for node table
CREATE POLICY "Users can view their own nodes"
    ON public.node
    FOR SELECT
    TO authenticated
    USING (owner_id = auth.uid());

CREATE POLICY "Users can insert their own nodes"
    ON public.node
    FOR INSERT
    TO authenticated
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own nodes"
    ON public.node
    FOR UPDATE
    TO authenticated
    USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own nodes"
    ON public.node
    FOR DELETE
    TO authenticated
    USING (owner_id = auth.uid());