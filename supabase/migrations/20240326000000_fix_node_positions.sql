-- Update column names in the node table
ALTER TABLE IF EXISTS public.node 
  RENAME COLUMN IF EXISTS position_x TO x;

ALTER TABLE IF EXISTS public.node 
  RENAME COLUMN IF EXISTS position_y TO y;

-- Add columns if they don't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'node' AND column_name = 'x') THEN
    ALTER TABLE public.node ADD COLUMN x NUMERIC(10,2) DEFAULT 0;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'node' AND column_name = 'y') THEN
    ALTER TABLE public.node ADD COLUMN y NUMERIC(10,2) DEFAULT 0;
  END IF;
END $$;

-- Update any null values to default 0
UPDATE public.node SET x = 0 WHERE x IS NULL;
UPDATE public.node SET y = 0 WHERE y IS NULL;