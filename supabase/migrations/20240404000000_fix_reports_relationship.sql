-- Drop existing foreign key if it exists
ALTER TABLE IF EXISTS public.reports
DROP CONSTRAINT IF EXISTS reports_investigation_id_fkey;

-- Add the foreign key constraint with proper relationship
ALTER TABLE public.reports
ADD CONSTRAINT reports_investigation_id_fkey 
FOREIGN KEY (investigation_id) 
REFERENCES public.investigations(id) 
ON DELETE CASCADE;

-- Enable RLS for reports table if not already enabled
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Update the RLS policies
DROP POLICY IF EXISTS "Enable read access for all users" ON public.reports;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.reports;
DROP POLICY IF EXISTS "Enable update for report owners" ON public.reports;
DROP POLICY IF EXISTS "Enable delete for report owners" ON public.reports;

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