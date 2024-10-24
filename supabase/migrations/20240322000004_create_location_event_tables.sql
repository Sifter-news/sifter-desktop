-- Location and event tables
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
    project_id UUID REFERENCES public.project(id),
    parent_event_id UUID REFERENCES public.node_event(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);