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