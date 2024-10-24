-- Generic node table
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

-- Node type-specific tables
CREATE TABLE public.node_person (
    node_id UUID PRIMARY KEY REFERENCES public.node(id),
    birth_date DATE,
    death_date DATE,
    gender VARCHAR(10),
    aliases TEXT[],
    online_usernames JSONB
);

CREATE TABLE public.node_organization (
    node_id UUID PRIMARY KEY REFERENCES public.node(id),
    legal_name VARCHAR(255),
    business_number VARCHAR(255),
    parent_org UUID REFERENCES public.node(id),
    subsidiary_org UUID REFERENCES public.node(id)
);

CREATE TABLE public.node_object (
    node_id UUID PRIMARY KEY REFERENCES public.node(id),
    object_type VARCHAR(50),
    ownership JSONB,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.node_concept (
    node_id UUID PRIMARY KEY REFERENCES public.node(id),
    definition TEXT,
    evolving_meanings JSONB
);