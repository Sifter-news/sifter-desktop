-- Create reports table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.report (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT,
    investigation_id UUID REFERENCES public.investigation(id) ON DELETE CASCADE,
    author_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.report ENABLE ROW LEVEL SECURITY;

-- Create policies for report table
CREATE POLICY "Users can view reports of their investigations"
    ON public.report FOR SELECT
    TO authenticated
    USING (
        investigation_id IN (
            SELECT id FROM public.investigation WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert reports to their investigations"
    ON public.report FOR INSERT
    TO authenticated
    WITH CHECK (
        investigation_id IN (
            SELECT id FROM public.investigation WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update reports in their investigations"
    ON public.report FOR UPDATE
    TO authenticated
    USING (
        investigation_id IN (
            SELECT id FROM public.investigation WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete reports in their investigations"
    ON public.report FOR DELETE
    TO authenticated
    USING (
        investigation_id IN (
            SELECT id FROM public.investigation WHERE owner_id = auth.uid()
        )
    );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS report_investigation_id_idx ON public.report(investigation_id);
CREATE INDEX IF NOT EXISTS report_author_id_idx ON public.report(author_id);
CREATE INDEX IF NOT EXISTS report_created_at_idx ON public.report(created_at DESC);