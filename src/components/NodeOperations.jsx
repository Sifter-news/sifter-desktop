import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import { findAvailablePosition } from '@/utils/canvasUtils';

export const useNodeOperations = (setNodes) => {
  const handleAddNode = async (newNode, projectId) => {
    try {
      const position = findAvailablePosition([]);
      const nodeWithPosition = {
        title: newNode.title,
        description: newNode.description,
        type: newNode.type,
        investigation_id: projectId,
        x: position.x,
        y: position.y
      };

      const { data, error } = await supabase
        .from('node')
        .insert([nodeWithPosition])
        .select()
        .single();

      if (error) throw error;

      // Add the width property after fetching from database
      const nodeWithUI = {
        ...data,
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
      // Remove width from database updates
      const { width, ...databaseUpdates } = {
        title: updates.title,
        description: updates.description,
        x: updates.x,
        y: updates.y
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