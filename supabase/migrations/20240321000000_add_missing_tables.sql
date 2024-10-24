-- Enable necessary extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Update profiles table with subscription fields
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS subscription_plan_id UUID REFERENCES public.subscription_plans(id),
ADD COLUMN IF NOT EXISTS subscription_start_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS subscription_end_date TIMESTAMP;

-- Create organization table
CREATE TABLE IF NOT EXISTS public.organization (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create organization_subscription table
CREATE TABLE IF NOT EXISTS public.organization_subscription (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES public.organization(id),
    plan_id UUID REFERENCES public.subscription_plans(id),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create project_access table
CREATE TABLE IF NOT EXISTS public.project_access (
    investigation_id UUID REFERENCES public.investigations(id),
    user_id UUID REFERENCES public.profiles(id),
    role VARCHAR(50) NOT NULL,
    PRIMARY KEY (investigation_id, user_id)
);

-- Create node_person table
CREATE TABLE IF NOT EXISTS public.node_person (
    node_id UUID PRIMARY KEY REFERENCES public.node(id),
    birth_date DATE,
    death_date DATE,
    gender VARCHAR(50),
    aliases TEXT[],
    online_usernames JSONB
);

-- Create node_organization table
CREATE TABLE IF NOT EXISTS public.node_organization (
    node_id UUID PRIMARY KEY REFERENCES public.node(id),
    legal_name VARCHAR(255),
    business_number VARCHAR(100),
    parent_org UUID REFERENCES public.node(id),
    subsidiary_org UUID REFERENCES public.node(id)
);

-- Create node_object table
CREATE TABLE IF NOT EXISTS public.node_object (
    node_id UUID PRIMARY KEY REFERENCES public.node(id),
    object_type VARCHAR(50),
    ownership JSONB,
    metadata JSONB
);

-- Create node_concept table
CREATE TABLE IF NOT EXISTS public.node_concept (
    node_id UUID PRIMARY KEY REFERENCES public.node(id),
    definition TEXT,
    evolving_meanings JSONB
);

-- Create log_node_chain_of_custody table
CREATE TABLE IF NOT EXISTS public.log_node_chain_of_custody (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id UUID REFERENCES public.node(id),
    version_number INTEGER DEFAULT 1,
    change_type VARCHAR(50),
    change_description TEXT,
    custody_event BOOLEAN DEFAULT false,
    file_hash TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    performed_by UUID REFERENCES public.profiles(id),
    source_location TEXT,
    recipient_person UUID REFERENCES public.node(id),
    is_physical BOOLEAN DEFAULT false
);

-- Create log_node_suggestions table
CREATE TABLE IF NOT EXISTS public.log_node_suggestions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id UUID REFERENCES public.node(id),
    user_id UUID REFERENCES public.profiles(id),
    suggestion TEXT,
    status VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create log_investigation table
CREATE TABLE IF NOT EXISTS public.log_investigation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_id UUID REFERENCES public.investigations(id),
    action_type VARCHAR(50),
    performed_by UUID REFERENCES public.profiles(id),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create log_user table
CREATE TABLE IF NOT EXISTS public.log_user (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id),
    activity_type VARCHAR(50),
    description TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add some basic RLS policies
ALTER TABLE public.organization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_subscription ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.node_person ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.node_organization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.node_object ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.node_concept ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_node_chain_of_custody ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_node_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_investigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.log_user ENABLE ROW LEVEL SECURITY;
