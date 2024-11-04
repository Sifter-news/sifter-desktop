-- Update node_person table with new fields
ALTER TABLE public.node_person
ADD COLUMN IF NOT EXISTS known_as VARCHAR(255),
ADD COLUMN IF NOT EXISTS title VARCHAR(50),
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS middle_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS date_of_death DATE,
ADD COLUMN IF NOT EXISTS background TEXT,
ADD COLUMN IF NOT EXISTS roles TEXT[];

-- Add indexes for improved query performance
CREATE INDEX IF NOT EXISTS idx_node_person_known_as ON public.node_person(known_as);
CREATE INDEX IF NOT EXISTS idx_node_person_names ON public.node_person(first_name, last_name);