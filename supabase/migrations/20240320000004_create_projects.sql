-- Table: project
CREATE TABLE IF NOT EXISTS public.project (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES public.profiles(id),
    visibility VARCHAR(20) DEFAULT 'private',
    view_type VARCHAR(20) DEFAULT 'mind',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: project_access
CREATE TABLE IF NOT EXISTS public.project_access (
    project_id UUID REFERENCES public.project(id),
    user_id UUID REFERENCES public.profiles(id),
    role VARCHAR(20) DEFAULT 'viewer',
    PRIMARY KEY (project_id, user_id)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_project_owner ON public.project(owner_id);
CREATE INDEX IF NOT EXISTS idx_project_created_at ON public.project(created_at);

-- Insert some sample data
INSERT INTO public.project (title, description, owner_id, visibility)
SELECT 
    'Sample Project',
    'This is a sample project created automatically',
    profiles.id,
    'public'
FROM public.profiles
WHERE profiles.username = 'admin@sifter.news'
LIMIT 1;