-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable PostGIS for location data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Table: profiles (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(username)
);

-- Table: subscription_plan
CREATE TABLE public.subscription_plan (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2),
    description TEXT,
    stripe_plan_id VARCHAR(255) UNIQUE
);

-- Table: subscription
CREATE TABLE public.subscription (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id),
    plan_id UUID REFERENCES public.subscription_plan(id),
    stripe_subscription_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    start_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP,
    last_payment_date TIMESTAMP
);

-- Table: user_role
CREATE TABLE public.user_role (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL,
    description TEXT
);

-- Table: user_role_assignment
CREATE TABLE public.user_role_assignment (
    user_id UUID REFERENCES public.profiles(id),
    role_id UUID REFERENCES public.user_role(id),
    PRIMARY KEY (user_id, role_id)
);

-- Table: project
CREATE TABLE public.project (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES public.profiles(id),
    visibility VARCHAR(20) DEFAULT 'private',
    view_type VARCHAR(20) DEFAULT 'mind',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: project_access
CREATE TABLE public.project_access (
    project_id UUID REFERENCES public.project(id),
    user_id UUID REFERENCES public.profiles(id),
    role VARCHAR(20) DEFAULT 'viewer',
    PRIMARY KEY (project_id, user_id)
);

-- Table: node
CREATE TABLE public.node (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    description TEXT,
    type VARCHAR(50),
    avatar TEXT DEFAULT 'default_avatar.png',
    is_public BOOLEAN DEFAULT FALSE,
    owner_id UUID REFERENCES public.profiles(id),
    project_id UUID REFERENCES public.project(id),
    parent_node_id UUID REFERENCES public.node(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: person_node
CREATE TABLE public.person_node (
    node_id UUID PRIMARY KEY REFERENCES public.node(id),
    birth_date DATE,
    death_date DATE,
    gender VARCHAR(10),
    aliases TEXT[],
    online_usernames JSONB
);

-- Table: organization_node
CREATE TABLE public.organization_node (
    node_id UUID PRIMARY KEY REFERENCES public.node(id),
    legal_name VARCHAR(255),
    business_number VARCHAR(255),
    parent_org UUID REFERENCES public.node(id),
    subsidiary_org UUID REFERENCES public.node(id)
);

-- Table: object_node
CREATE TABLE public.object_node (
    node_id UUID PRIMARY KEY REFERENCES public.node(id),
    object_type VARCHAR(50),
    ownership JSONB
);

-- Table: concept_node
CREATE TABLE public.concept_node (
    node_id UUID PRIMARY KEY REFERENCES public.node(id),
    definition TEXT,
    evolving_meanings JSONB
);

-- Table: location
CREATE TABLE public.location (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    coordinates geometry(Point, 4326),
    description TEXT
);

-- Table: event
CREATE TABLE public.event (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name VARCHAR(255),
    event_type VARCHAR(50),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    location_id UUID REFERENCES public.location(id),
    description TEXT,
    project_id UUID REFERENCES public.project(id),
    parent_event_id UUID REFERENCES public.event(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: pending_edits
CREATE TABLE public.pending_edits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id UUID REFERENCES public.node(id),
    user_id UUID REFERENCES public.profiles(id),
    suggestion TEXT,
    status VARCHAR(20) DEFAULT 'pending'
);

-- Create trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Add RLS policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.node ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_access ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Project policies
CREATE POLICY "Users can view their own projects"
  ON public.project FOR SELECT
  USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own projects"
  ON public.project FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own projects"
  ON public.project FOR UPDATE
  USING (auth.uid() = owner_id);

-- Node policies
CREATE POLICY "Users can view nodes of their projects"
  ON public.node FOR SELECT
  USING (
    auth.uid() = owner_id OR
    project_id IN (
      SELECT project_id FROM public.project_access
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert nodes in their projects"
  ON public.node FOR INSERT
  WITH CHECK (
    auth.uid() = owner_id AND
    project_id IN (
      SELECT id FROM public.project
      WHERE owner_id = auth.uid()
    )
  );