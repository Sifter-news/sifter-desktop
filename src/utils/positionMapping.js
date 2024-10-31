import { supabase } from '@/config/supabase';
import { toast } from 'sonner';

const generateRandomPosition = () => ({
  x: (Math.random() * 1000) - 500, // Random value between -500 and 500
  y: (Math.random() * 1000) - 500,
  z: 0
});

export const mapNodePositions = async (nodes) => {
  const updates = nodes.map(async (node) => {
    // If node has no position, generate random values
    const position = {
      position_x: node.position_x ?? node.x ?? generateRandomPosition().x,
      position_y: node.position_y ?? node.y ?? generateRandomPosition().y,
      position_z: node.position_z ?? 0
    };

    try {
      const { error } = await supabase
        .from('node')
        .update(position)
        .eq('id', node.id);

      if (error) throw error;

      return {
        ...node,
        ...position,
        position: [position.position_x, position.position_y, position.position_z]
      };
    } catch (error) {
      console.error('Error updating node position:', error);
      toast.error(`Failed to update position for node: ${node.title}`);
      return node;
    }
  });

  return Promise.all(updates);
};