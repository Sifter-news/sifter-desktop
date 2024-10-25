-- Create investigation and related tables
CREATE TABLE public.investigations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    visibility VARCHAR(20) DEFAULT 'private',
    view_type VARCHAR(20) DEFAULT 'mind'
);

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

-- Create indexes for better performance
CREATE INDEX idx_reports_investigation_id ON public.reports(investigation_id);
CREATE INDEX idx_investigations_owner_id ON public.investigations(owner_id);