-- Create investigations table
CREATE TABLE IF NOT EXISTS public.investigation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES public.profiles(id),
    organization_id UUID REFERENCES public.organization(id),
    visibility TEXT DEFAULT 'private',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create investigation access table
CREATE TABLE IF NOT EXISTS public.investigation_access (
    investigation_id UUID REFERENCES public.investigation(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'viewer',
    PRIMARY KEY (investigation_id, user_id)
);

ALTER TABLE public.investigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investigation_access ENABLE ROW LEVEL SECURITY;