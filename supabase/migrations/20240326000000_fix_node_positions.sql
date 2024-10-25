-- Ensure the node table has the correct column names
ALTER TABLE IF EXISTS public.node 
  RENAME COLUMN IF EXISTS x TO position_x;

ALTER TABLE IF EXISTS public.node 
  RENAME COLUMN IF EXISTS y TO position_y;

-- Add columns if they don't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'node' AND column_name = 'position_x') THEN
    ALTER TABLE public.node ADD COLUMN position_x NUMERIC(10,2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'node' AND column_name = 'position_y') THEN
    ALTER TABLE public.node ADD COLUMN position_y NUMERIC(10,2) DEFAULT 0;
  END IF;
END $$;

-- Update any null values to default 0
UPDATE public.node SET position_x = 0 WHERE position_x IS NULL;
UPDATE public.node SET position_y = 0 WHERE position_y IS NULL;