import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';

export const deleteNode = async (nodeId, onSuccess) => {
  try {
    const { error } = await supabase
      .from('node')
      .delete()
      .eq('id', nodeId);

    if (error) throw error;
    
    if (onSuccess) {
      onSuccess();
    }
    toast.success('Node deleted successfully');
  } catch (error) {
    console.error('Error deleting node:', error);
    toast.error('Failed to delete node');
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
    console.error('Error updating node:', error);
    toast.error('Failed to update node');
    throw error;
  }
};