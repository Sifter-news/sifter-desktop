-- Create node and specialized node tables
CREATE TABLE public.nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    description TEXT,
    type VARCHAR(50),
    owner_id UUID REFERENCES public.profiles(id),
    investigation_id UUID REFERENCES public.investigations(id),
    parent_node_id UUID REFERENCES public.nodes(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    x INTEGER DEFAULT 0,
    y INTEGER DEFAULT 0,
    width INTEGER DEFAULT 200,
    height INTEGER DEFAULT 200
);

CREATE TABLE public.node_person (
    node_id UUID PRIMARY KEY REFERENCES public.nodes(id) ON DELETE CASCADE,
    birth_date DATE,
    death_date DATE,
    gender VARCHAR(10),
    aliases TEXT[],
    online_usernames JSONB
);

CREATE TABLE public.node_organization (
    node_id UUID PRIMARY KEY REFERENCES public.nodes(id) ON DELETE CASCADE,
    legal_name VARCHAR(255),
    business_number VARCHAR(255)
);

CREATE TABLE public.node_location (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    coordinates GEOGRAPHY(POINT, 4326),
    description TEXT
);

CREATE TABLE public.node_event (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_name VARCHAR(255),
    event_type VARCHAR(50),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    location_id UUID REFERENCES public.node_location(id),
    description TEXT,
    investigation_id UUID REFERENCES public.investigations(id),
    parent_event_id UUID REFERENCES public.node_event(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.node_concept (
    node_id UUID PRIMARY KEY REFERENCES public.nodes(id) ON DELETE CASCADE,
    definition TEXT,
    evolving_meanings JSONB
);