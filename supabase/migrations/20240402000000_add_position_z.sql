-- Add position_z column to node table
ALTER TABLE public.node
ADD COLUMN IF NOT EXISTS position_z DECIMAL(10,2) DEFAULT 0;

-- Update existing nodes to have z position of 0
UPDATE public.node
SET position_z = 0
WHERE position_z IS NULL;

-- Update the index to include z coordinate
DROP INDEX IF EXISTS idx_node_coordinates;
CREATE INDEX idx_node_coordinates ON public.node(position_x, position_y, position_z);