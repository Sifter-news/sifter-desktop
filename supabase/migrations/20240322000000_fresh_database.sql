-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Drop all existing tables (in correct order to handle dependencies)
DROP TABLE IF EXISTS public.log_node_suggestions CASCADE;
DROP TABLE IF EXISTS public.log_node_versions CASCADE;
DROP TABLE IF EXISTS public.log_chain_of_custody CASCADE;
DROP TABLE IF EXISTS public.log_node CASCADE;
DROP TABLE IF EXISTS public.log_project CASCADE;
DROP TABLE IF EXISTS public.log_user CASCADE;
DROP TABLE IF EXISTS public.node_person CASCADE;
DROP TABLE IF EXISTS public.node_organization CASCADE;
DROP TABLE IF EXISTS public.node_object CASCADE;
DROP TABLE IF EXISTS public.node_concept CASCADE;
DROP TABLE IF EXISTS public.node_location CASCADE;
DROP TABLE IF EXISTS public.node_event CASCADE;
DROP TABLE IF EXISTS public.node CASCADE;
DROP TABLE IF EXISTS public.project_access CASCADE;
DROP TABLE IF EXISTS public.project CASCADE;
DROP TABLE IF EXISTS public.organization_subscription CASCADE;
DROP TABLE IF EXISTS public.organization CASCADE;
DROP TABLE IF EXISTS public.subscription_plan CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create subscription plans
CREATE TABLE public.subscription_plan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    price DECIMAL(10, 2),
    description TEXT,
    features JSONB
);

-- Create organizations table
CREATE TABLE public.organization (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create organization subscriptions
CREATE TABLE public.organization_subscription (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organization(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES public.subscription_plan(id),
    start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active'
);

-- Create projects table
CREATE TABLE public.project (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES public.profiles(id),
    organization_id UUID REFERENCES public.organization(id),
    visibility TEXT DEFAULT 'private',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create project access table
CREATE TABLE public.project_access (
    project_id UUID REFERENCES public.project(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'viewer',
    PRIMARY KEY (project_id, user_id)
);

-- Create nodes table
CREATE TABLE public.node (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    avatar TEXT DEFAULT 'default_avatar.png',
    is_public BOOLEAN DEFAULT FALSE,
    owner_id UUID REFERENCES public.profiles(id),
    project_id UUID REFERENCES public.project(id) ON DELETE CASCADE,
    parent_node_id UUID REFERENCES public.node(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create specialized node tables
CREATE TABLE public.node_person (
    node_id UUID PRIMARY KEY REFERENCES public.node(id) ON DELETE CASCADE,
    birth_date TIMESTAMP WITH TIME ZONE,
    death_date TIMESTAMP WITH TIME ZONE,
    gender TEXT,
    aliases TEXT[],
    online_usernames JSONB
);

CREATE TABLE public.node_organization (
    node_id UUID PRIMARY KEY REFERENCES public.node(id) ON DELETE CASCADE,
    legal_name TEXT,
    business_number TEXT,
    parent_org UUID REFERENCES public.node(id),
    subsidiary_org UUID REFERENCES public.node(id)
);

CREATE TABLE public.node_object (
    node_id UUID PRIMARY KEY REFERENCES public.node(id) ON DELETE CASCADE,
    object_type TEXT,
    ownership JSONB,
    metadata JSONB
);

CREATE TABLE public.node_concept (
    node_id UUID PRIMARY KEY REFERENCES public.node(id) ON DELETE CASCADE,
    definition TEXT,
    evolving_meanings JSONB
);

CREATE TABLE public.node_location (
    node_id UUID PRIMARY KEY REFERENCES public.node(id) ON DELETE CASCADE,
    coordinates GEOGRAPHY(Point, 4326),
    address TEXT,
    country_code TEXT
);

CREATE TABLE public.node_event (
    node_id UUID PRIMARY KEY REFERENCES public.node(id) ON DELETE CASCADE,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    location_id UUID REFERENCES public.node_location(node_id),
    event_type TEXT
);

-- Create logging tables
CREATE TABLE public.log_node_chain_of_custody (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id UUID REFERENCES public.node(id) ON DELETE CASCADE,
    version_number INTEGER DEFAULT 1,
    change_type TEXT,
    change_description TEXT,
    custody_event BOOLEAN DEFAULT FALSE,
    file_hash TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    performed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    source_location TEXT,
    recipient_person UUID REFERENCES public.node(id),
    is_physical BOOLEAN DEFAULT FALSE,
    previous_version_id UUID REFERENCES public.log_node_chain_of_custody(id) ON DELETE SET NULL
);

CREATE TABLE public.log_node_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id UUID REFERENCES public.node(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    suggestion TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.log_project (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.project(id) ON DELETE CASCADE,
    action_type TEXT,
    performed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.log_user (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_type TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.node ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can view their projects and public projects"
    ON public.project FOR SELECT
    USING (
        auth.uid() = owner_id 
        OR visibility = 'public'
        OR id IN (
            SELECT project_id FROM public.project_access 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create projects"
    ON public.project FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Project owners can update their projects"
    ON public.project FOR UPDATE
    USING (auth.uid() = owner_id);

-- Insert default subscription plans
INSERT INTO public.subscription_plan (name, price, description, features) 
VALUES 
    ('Free', 0, 'Basic features for individual use', '{"projects": 3, "storage": "1GB"}'),
    ('Pro', 9.99, 'Advanced features for professionals', '{"projects": -1, "storage": "50GB"}'),
    ('Team', 29.99, 'Collaborative features for teams', '{"projects": -1, "storage": "500GB", "team_features": true}');