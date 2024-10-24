-- Create location table
CREATE TABLE public.node_location (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255),
    coordinates GEOGRAPHY (point, 4326),
    description TEXT
);

-- Create event table
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