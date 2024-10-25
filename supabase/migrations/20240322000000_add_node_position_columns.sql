-- Add position and dimension columns to node table if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'node' AND column_name = 'x') THEN
        ALTER TABLE public.node ADD COLUMN x FLOAT DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'node' AND column_name = 'y') THEN
        ALTER TABLE public.node ADD COLUMN y FLOAT DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'node' AND column_name = 'width') THEN
        ALTER TABLE public.node ADD COLUMN width INTEGER DEFAULT 200;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'node' AND column_name = 'height') THEN
        ALTER TABLE public.node ADD COLUMN height INTEGER DEFAULT 200;
    END IF;
END $$;