-- Drop the existing foreign key constraint
ALTER TABLE public.node DROP CONSTRAINT IF EXISTS node_investigation_id_fkey;

-- Re-create the constraint with CASCADE delete
ALTER TABLE public.node
  ADD CONSTRAINT node_investigation_id_fkey 
  FOREIGN KEY (investigation_id) 
  REFERENCES public.investigations(id) 
  ON DELETE CASCADE;