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
        node_type: newNode.nodeType || 'generic',
        visual_style: newNode.visualStyle || 'expanded',
        position_x: newNode.x || position.x,
        position_y: newNode.y || position.y,
        width: newNode.width || 200,
        height: newNode.height || 100,
        investigation_id: projectId
      };

      const { data, error } = await supabase
        .from('node')
        .insert([nodeData])
        .select()
        .single();

      if (error) throw error;

      // Transform database fields to UI format
      const nodeWithUI = {
        ...data,
        x: data.position_x,
        y: data.position_y,
        nodeType: data.node_type,
        visualStyle: data.visual_style,
        width: data.width,
        height: data.height
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
        position_y: updates.y,
        node_type: updates.nodeType,
        visual_style: updates.visualStyle,
        width: updates.width,
        height: updates.height
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