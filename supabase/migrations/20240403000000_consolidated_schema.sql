-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    subscription_plan_id UUID,
    subscription_start_date TIMESTAMP WITH TIME ZONE,
    subscription_end_date TIMESTAMP WITH TIME ZONE
);

-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2),
    description TEXT,
    stripe_plan_id VARCHAR(255) UNIQUE
);

-- Create investigations table
CREATE TABLE IF NOT EXISTS public.investigations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    visibility VARCHAR(20) DEFAULT 'private',
    view_type VARCHAR(20) DEFAULT 'mind',
    investigation_type VARCHAR(50) DEFAULT 'generic',
    investigation_focus VARCHAR(50) DEFAULT 'node_person'
);

-- Create node table with all necessary columns
CREATE TABLE IF NOT EXISTS public.node (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    description TEXT,
    avatar TEXT DEFAULT 'default_avatar.png',
    is_public BOOLEAN DEFAULT FALSE,
    owner_id UUID REFERENCES public.profiles(id),
    investigation_id UUID REFERENCES public.investigations(id),
    parent_id UUID REFERENCES public.node(id) ON DELETE SET NULL,
    position_x DECIMAL(10,2) DEFAULT 0,
    position_y DECIMAL(10,2) DEFAULT 0,
    position_z DECIMAL(10,2) DEFAULT 0,
    width DECIMAL(10,2) DEFAULT 200,
    height DECIMAL(10,2) DEFAULT 100,
    visual_style VARCHAR(50) DEFAULT 'default',
    node_type VARCHAR(50) DEFAULT 'generic',
    text_size VARCHAR(20) DEFAULT 'medium',
    text_align VARCHAR(20) DEFAULT 'left',
    color VARCHAR(20) DEFAULT 'white',
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create reports table
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_id UUID REFERENCES public.investigations(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create connections table
CREATE TABLE IF NOT EXISTS public.connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    source_id UUID REFERENCES public.node(id) ON DELETE CASCADE,
    target_id UUID REFERENCES public.node(id) ON DELETE CASCADE,
    source_point TEXT,
    target_point TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_reports_investigation_id ON public.reports(investigation_id);
CREATE INDEX IF NOT EXISTS idx_investigations_owner_id ON public.investigations(owner_id);
CREATE INDEX IF NOT EXISTS idx_node_investigation_id ON public.node(investigation_id);
CREATE INDEX IF NOT EXISTS idx_node_coordinates ON public.node(position_x, position_y, position_z);
CREATE INDEX IF NOT EXISTS connections_source_id_idx ON public.connections(source_id);
CREATE INDEX IF NOT EXISTS connections_target_id_idx ON public.connections(target_id);

-- Enable Row Level Security
ALTER TABLE public.investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.node ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.investigations;
    DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.investigations;
    DROP POLICY IF EXISTS "Enable update for investigation owners" ON public.investigations;
    DROP POLICY IF EXISTS "Enable delete for investigation owners" ON public.investigations;
    
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.reports;
    DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.reports;
    DROP POLICY IF EXISTS "Enable update for report owners" ON public.reports;
    DROP POLICY IF EXISTS "Enable delete for report owners" ON public.reports;
    
    DROP POLICY IF EXISTS "Enable read access for all users" ON public.connections;
    DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.connections;
    DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.connections;
    DROP POLICY IF EXISTS "Enable delete for authenticated users" ON public.connections;
EXCEPTION
    WHEN undefined_object THEN
        NULL;
END $$;

-- Create RLS policies
CREATE POLICY "Enable read access for all users" ON public.investigations FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON public.investigations FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Enable update for investigation owners" ON public.investigations FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Enable delete for investigation owners" ON public.investigations FOR DELETE USING (auth.uid() = owner_id);

CREATE POLICY "Enable read access for all users" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.reports FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.owner_id = auth.uid()
));
CREATE POLICY "Enable update for report owners" ON public.reports FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.owner_id = auth.uid()
));
CREATE POLICY "Enable delete for report owners" ON public.reports FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.owner_id = auth.uid()
));

CREATE POLICY "Enable read access for all users" ON public.connections FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON public.connections FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users" ON public.connections FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users" ON public.connections FOR DELETE USING (auth.role() = 'authenticated');
