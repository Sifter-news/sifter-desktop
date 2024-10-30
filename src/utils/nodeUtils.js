import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import { NODE_STYLES } from './nodeStyles';

// Node dimensions
export const getNodeDimensions = (visualStyle) => {
  const style = NODE_STYLES[visualStyle || 'default'];
  return {
    width: style.width || 256,
    height: style.height || 256,
    depth: visualStyle === 'cube' ? (style.width || 256) / 20 : 0.5
  };
};

// Position utilities
export const generateRandomPosition = () => ({
  x: (Math.random() * 100) - 50,
  y: (Math.random() * 100) - 50,
  z: 0
});

// Node operations
export const createNode = async (nodeData, projectId) => {
  try {
    const { data, error } = await supabase
      .from('node')
      .insert([{
        ...nodeData,
        investigation_id: projectId,
      }])
      .select()
      .single();

    if (error) throw error;
    toast.success('Node created successfully');
    return data;
  } catch (error) {
    toast.error('Failed to create node');
    throw error;
  }
};

export const updateNode = async (nodeId, updates) => {
  try {
    const { error } = await supabase
      .from('node')
      .update({
        title: updates.title,
        description: updates.description,
        type: updates.type,
        visual_style: updates.visualStyle,
        position_x: updates.x,
        position_y: updates.y,
        position_z: updates.z,
        metadata: updates.metadata,
        node_type: updates.nodeType
      })
      .eq('id', nodeId);

    if (error) throw error;
    toast.success('Node updated successfully');
  } catch (error) {
    toast.error('Failed to update node');
    throw error;
  }
};

export const deleteNode = async (nodeId) => {
  try {
    const { error } = await supabase
      .from('node')
      .delete()
      .eq('id', nodeId);

    if (error) throw error;
    toast.success('Node deleted successfully');
  } catch (error) {
    toast.error('Failed to delete node');
    throw error;
  }
};