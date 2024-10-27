import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import { findAvailablePosition } from '@/utils/canvasUtils';

export const useNodeOperations = (setNodes) => {
  const handleAddNode = async (newNode, projectId) => {
    try {
      const position = findAvailablePosition([]);
      const nodeData = {
        title: newNode.title,
        description: newNode.description,
        type: newNode.type,
        investigation_id: projectId,
        position_x: newNode.x || position.x,
        position_y: newNode.y || position.y
      };

      const { data, error } = await supabase
        .from('node')
        .insert([nodeData])
        .select()
        .single();

      if (error) throw error;

      // Add UI-specific properties
      const nodeWithUI = {
        ...data,
        x: data.position_x || 0,
        y: data.position_y || 0,
        width: newNode.width || 200
      };

      setNodes(prevNodes => [...prevNodes, nodeWithUI]);
      toast.success('Node added successfully');
    } catch (error) {
      console.error('Error adding node:', error);
      toast.error('Failed to add node');
    }
  };

  const handleUpdateNode = async (nodeId, updates) => {
    try {
      const databaseUpdates = {
        title: updates.title,
        description: updates.description,
        position_x: updates.x,
        position_y: updates.y
      };

      const { error } = await supabase
        .from('node')
        .update(databaseUpdates)
        .eq('id', nodeId);

      if (error) throw error;

      setNodes(prevNodes => prevNodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      ));
    } catch (error) {
      console.error('Error updating node:', error);
      toast.error('Failed to update node');
    }
  };

  const handleDeleteNode = async (nodeId) => {
    try {
      const { error } = await supabase
        .from('node')
        .delete()
        .eq('id', nodeId);

      if (error) throw error;

      setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
      toast.success('Node deleted successfully');
    } catch (error) {
      console.error('Error deleting node:', error);
      toast.error('Failed to delete node');
    }
  };

  return { handleAddNode, handleUpdateNode, handleDeleteNode };
};