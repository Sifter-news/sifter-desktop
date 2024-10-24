-- Create investigations table
CREATE TABLE IF NOT EXISTS public.investigation (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create reports table with proper foreign key
CREATE TABLE IF NOT EXISTS public.report (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT,
    investigation_id UUID REFERENCES public.investigation(id) ON DELETE CASCADE,
    author_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.investigation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report ENABLE ROW LEVEL SECURITY;

-- Create policies for investigation table
CREATE POLICY "Users can view their own investigations"
    ON public.investigation FOR SELECT
    TO authenticated
    USING (owner_id = auth.uid());

CREATE POLICY "Users can insert their own investigations"
    ON public.investigation FOR INSERT
    TO authenticated
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own investigations"
    ON public.investigation FOR UPDATE
    TO authenticated
    USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own investigations"
    ON public.investigation FOR DELETE
    TO authenticated
    USING (owner_id = auth.uid());

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