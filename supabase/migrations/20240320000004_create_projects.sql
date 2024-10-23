-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: projects (renamed from project to match the error message)
CREATE TABLE IF NOT EXISTS public.projects (
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
    project_id UUID REFERENCES public.projects(id),
    user_id UUID REFERENCES public.profiles(id),
    role VARCHAR(20) DEFAULT 'viewer',
    PRIMARY KEY (project_id, user_id)
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_owner ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at);