-- Add position_z column to node table if it doesn't exist
ALTER TABLE public.node
ADD COLUMN IF NOT EXISTS position_z DECIMAL(10,2) DEFAULT 0;

-- Recreate the coordinates index to include position_z
DROP INDEX IF EXISTS idx_node_coordinates;
CREATE INDEX idx_node_coordinates ON public.node(position_x, position_y, position_z);