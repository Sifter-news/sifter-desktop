-- Create projects table
CREATE TABLE IF NOT EXISTS public.project (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES public.profiles(id),
    organization_id UUID REFERENCES public.organization(id),
    visibility TEXT DEFAULT 'private',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create project access table
CREATE TABLE IF NOT EXISTS public.project_access (
    project_id UUID REFERENCES public.project(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'viewer',
    PRIMARY KEY (project_id, user_id)
);

ALTER TABLE public.project ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_access ENABLE ROW LEVEL SECURITY;