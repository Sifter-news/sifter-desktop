-- Create location nodes
CREATE TABLE IF NOT EXISTS public.node_location (
    node_id UUID PRIMARY KEY REFERENCES public.node(id) ON DELETE CASCADE,
    coordinates GEOGRAPHY(Point, 4326),
    address TEXT,
    country_code TEXT
);

-- Create event nodes
CREATE TABLE IF NOT EXISTS public.node_event (
    node_id UUID PRIMARY KEY REFERENCES public.node(id) ON DELETE CASCADE,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    location_id UUID REFERENCES public.node_location(node_id),
    event_type TEXT
);

ALTER TABLE public.node_location ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.node_event ENABLE ROW LEVEL SECURITY;