-- Create nodes table
CREATE TABLE IF NOT EXISTS public.node (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    owner_id UUID REFERENCES public.profiles(id),
    project_id UUID REFERENCES public.project(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.node ENABLE ROW LEVEL SECURITY;