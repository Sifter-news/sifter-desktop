import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/supabase';
export { getNodeDimensions, getNodeStyle, NODE_STYLES } from './nodeStyles';
export { 
  findAvailablePosition, 
  calculate3DDistance, 
  getNodeDimensions3D, 
  isColliding3D, 
  findNonCollidingPosition3D 
} from './nodePositioning';

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
      .update(updates)
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

export const handleNodeDelete = async (nodeId, onDelete) => {
  try {
    const { error } = await supabase
      .from('node')
      .delete()
      .eq('id', nodeId);

    if (error) throw error;
    
    onDelete(nodeId);
    toast.success('Node deleted successfully');
  } catch (error) {
    console.error('Error deleting node:', error);
    toast.error('Failed to delete node');
  }
};