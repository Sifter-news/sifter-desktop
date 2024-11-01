import { supabase } from '@/config/supabase';
import { toast } from 'sonner';

export const handleNodeDelete = async (nodeId, onSuccess) => {
  try {
    const { error } = await supabase
      .from('node')
      .delete()
      .eq('id', nodeId);

    if (error) throw error;
    
    // Call the success callback to update UI state
    if (onSuccess) {
      onSuccess(nodeId);
    }
    
    toast.success('Node deleted successfully');
  } catch (error) {
    console.error('Error deleting node:', error);
    toast.error('Failed to delete node');
    throw error;
  }
};