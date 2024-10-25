-- First drop existing columns if they exist to avoid conflicts
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'node' AND column_name = 'position_x') THEN
        ALTER TABLE public.node DROP COLUMN position_x;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'node' AND column_name = 'position_y') THEN
        ALTER TABLE public.node DROP COLUMN position_y;
    END IF;
END $$;

-- Add x and y columns with proper defaults
ALTER TABLE public.node 
    ADD COLUMN IF NOT EXISTS x NUMERIC(10,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS y NUMERIC(10,2) DEFAULT 0;

-- Update any existing null values
UPDATE public.node SET x = 0 WHERE x IS NULL;
UPDATE public.node SET y = 0 WHERE y IS NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_node_position 
ON public.node (x, y);