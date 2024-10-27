-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "wrappers" WITH SCHEMA "extensions";

-- Create profiles table first since it's referenced by other tables
DROP TABLE IF EXISTS public.profiles;
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) UNIQUE,
    avatar_url TEXT DEFAULT '/default-image.png',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subscription_plan_id UUID,
    subscription_start_date TIMESTAMP,
    subscription_end_date TIMESTAMP
);

-- Create subscription_plans table
DROP TABLE IF EXISTS public.subscription_plans;
CREATE TABLE public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2),
    description TEXT,
    stripe_plan_id VARCHAR(255) UNIQUE
);

-- Create investigations table after profiles
DROP TABLE IF EXISTS public.investigations;
CREATE TABLE public.investigations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    visibility VARCHAR(20) DEFAULT 'private',
    view_type VARCHAR(20) DEFAULT 'mind'
);

-- Create node table after profiles and investigations
DROP TABLE IF EXISTS public.node;
CREATE TABLE public.node (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    description TEXT,
    type VARCHAR(50),
    avatar TEXT DEFAULT 'default_avatar.png',
    is_public BOOLEAN DEFAULT FALSE,
    owner_id UUID REFERENCES public.profiles(id),
    investigation_id UUID REFERENCES public.investigations(id),
    parent_node_id UUID REFERENCES public.node(id) ON DELETE SET NULL,
    position_x NUMERIC(10,2) DEFAULT 0,
    position_y NUMERIC(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create reports table last
DROP TABLE IF EXISTS public.reports;
CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_id UUID REFERENCES public.investigations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE public.investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.node ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON public.investigations
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON public.investigations
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Enable update for investigation owners" ON public.investigations
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Enable delete for investigation owners" ON public.investigations
    FOR DELETE USING (auth.uid() = owner_id);

-- Create policies for reports
CREATE POLICY "Enable read access for all users" ON public.reports
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users" ON public.reports
    FOR INSERT WITH CHECK (EXISTS (
        SELECT 1 FROM public.investigations i 
        WHERE i.id = investigation_id AND i.owner_id = auth.uid()
    ));

CREATE POLICY "Enable update for report owners" ON public.reports
    FOR UPDATE USING (EXISTS (
        SELECT 1 FROM public.investigations i 
        WHERE i.id = investigation_id AND i.owner_id = auth.uid()
    ));

CREATE POLICY "Enable delete for report owners" ON public.reports
    FOR DELETE USING (EXISTS (
        SELECT 1 FROM public.investigations i 
        WHERE i.id = investigation_id AND i.owner_id = auth.uid()
    ));

-- Create indexes
CREATE INDEX idx_reports_investigation_id ON public.reports(investigation_id);
CREATE INDEX idx_investigations_owner_id ON public.investigations(owner_id);
CREATE INDEX idx_node_investigation_id ON public.node(investigation_id);
CREATE INDEX idx_node_coordinates ON public.node(position_x, position_y);