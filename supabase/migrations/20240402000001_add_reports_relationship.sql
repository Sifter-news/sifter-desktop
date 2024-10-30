-- Add foreign key relationship between investigations and reports
ALTER TABLE public.reports
ADD CONSTRAINT fk_investigation
FOREIGN KEY (investigation_id)
REFERENCES public.investigations(id)
ON DELETE CASCADE;

-- Add RLS policies for reports
CREATE POLICY "Enable read access for investigation owners" ON public.reports
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.investigations i 
            WHERE i.id = investigation_id 
            AND i.owner_id = auth.uid()
        )
    );

CREATE POLICY "Enable insert for investigation owners" ON public.reports
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.investigations i 
            WHERE i.id = investigation_id 
            AND i.owner_id = auth.uid()
        )
    );

CREATE POLICY "Enable update for investigation owners" ON public.reports
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.investigations i 
            WHERE i.id = investigation_id 
            AND i.owner_id = auth.uid()
        )
    );

CREATE POLICY "Enable delete for investigation owners" ON public.reports
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.investigations i 
            WHERE i.id = investigation_id 
            AND i.owner_id = auth.uid()
        )
    );