-- Add position_z column to node table if it doesn't exist
ALTER TABLE public.node
ADD COLUMN IF NOT EXISTS position_z DECIMAL(10,2) DEFAULT 0;

-- Update existing nodes to have z position of 0
UPDATE public.node
SET position_z = 0
WHERE position_z IS NULL;

-- Update the index to include z coordinate
DROP INDEX IF EXISTS idx_node_coordinates;
CREATE INDEX idx_node_coordinates ON public.node(position_x, position_y, position_z);

-- Verify the column exists and has proper constraints
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'node'
        AND column_name = 'position_z'
    ) THEN
        RAISE EXCEPTION 'position_z column was not created properly';
    END IF;
END
$$;