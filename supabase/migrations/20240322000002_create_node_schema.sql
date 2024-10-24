-- Create nodes table
CREATE TABLE IF NOT EXISTS public.node (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    owner_id UUID REFERENCES public.profiles(id),
    investigation_id UUID REFERENCES public.investigation(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (investigation_id) REFERENCES public.investigation(id)
);

ALTER TABLE public.node ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to select their own nodes
CREATE POLICY "Users can view their own nodes"
    ON public.node
    FOR SELECT
    TO authenticated
    USING (owner_id = auth.uid());

-- Create policy to allow users to insert their own nodes
CREATE POLICY "Users can insert their own nodes"
    ON public.node
    FOR INSERT
    TO authenticated
    WITH CHECK (owner_id = auth.uid());

-- Create policy to allow users to update their own nodes
CREATE POLICY "Users can update their own nodes"
    ON public.node
    FOR UPDATE
    TO authenticated
    USING (owner_id = auth.uid());

-- Create policy to allow users to delete their own nodes
CREATE POLICY "Users can delete their own nodes"
    ON public.node
    FOR DELETE
    TO authenticated
    USING (owner_id = auth.uid());