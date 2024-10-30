ALTER TABLE public.investigations
ADD COLUMN IF NOT EXISTS investigation_focus VARCHAR(50) DEFAULT 'node_person';