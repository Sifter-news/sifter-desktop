-- Remove the type column from the node table
ALTER TABLE public.node DROP COLUMN IF EXISTS type;