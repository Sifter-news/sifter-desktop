import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';

export const deleteNodeFromDatabase = async (nodeId) => {
  try {
    const { error } = await supabase
      .from('node')
      .delete()
      .eq('id', nodeId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting node:', error);
    throw error;
  }
};

export const handleNodeDelete = async (nodeId, setNodes, onNodeFocus = null) => {
  try {
    await deleteNodeFromDatabase(nodeId);
    
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    
    if (onNodeFocus) {
      onNodeFocus(null);
    }
    
    toast.success('Node deleted successfully');
  } catch (error) {
    console.error('Error deleting node:', error);
    toast.error('Failed to delete node');
  }
};