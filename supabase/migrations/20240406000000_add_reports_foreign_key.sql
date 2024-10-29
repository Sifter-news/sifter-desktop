-- Add foreign key constraint for reports table
ALTER TABLE public.reports
ADD CONSTRAINT reports_investigation_id_fkey 
FOREIGN KEY (investigation_id) 
REFERENCES public.investigations(id)
ON DELETE CASCADE;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_reports_investigation_id 
ON public.reports(investigation_id);