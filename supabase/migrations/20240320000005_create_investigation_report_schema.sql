-- Create investigation and report tables
CREATE TABLE public.investigations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    description TEXT,
    owner_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    description TEXT,
    investigation_id UUID REFERENCES public.investigations(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);