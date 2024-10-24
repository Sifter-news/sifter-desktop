-- Create table for managing projects
CREATE TABLE public.project (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES public.profiles(id),
    visibility VARCHAR(20) DEFAULT 'private',
    view_type VARCHAR(20) DEFAULT 'mind',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for controlling project access
CREATE TABLE public.project_access (
    project_id UUID REFERENCES public.project(id),
    user_id UUID REFERENCES public.profiles(id),
    role VARCHAR(20) DEFAULT 'viewer',
    PRIMARY KEY (project_id, user_id)
);