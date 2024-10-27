ALTER TABLE public.investigations
ADD COLUMN IF NOT EXISTS investigation_type VARCHAR(50) DEFAULT 'generic';