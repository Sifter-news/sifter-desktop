import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';

export const useNodeOperations = (setNodes) => {
  const handleAddNode = async (newNode, projectId) => {
    try {
      const nodeData = {
        title: newNode.title,
        description: newNode.description,
        type: newNode.type,
        investigation_id: projectId,
        visual_style: newNode.visualStyle || 'default',
        position_x: newNode.x || 0,
        position_y: newNode.y || 0,
        width: newNode.width || 200,
        height: newNode.height || 100,
        node_type: newNode.nodeType || 'generic',
        step: newNode.step || 1
      };

      const { data, error } = await supabase
        .from('node')
        .insert([nodeData])
        .select()
        .single();

      if (error) throw error;

      const nodeWithUI = {
        ...data,
        x: data.position_x,
        y: data.position_y,
        width: data.width,
        height: data.height,
        visualStyle: data.visual_style,
        nodeType: data.node_type,
        step: data.step
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
        type: updates.type,
        visual_style: updates.visualStyle,
        position_x: updates.x,
        position_y: updates.y,
        width: updates.width,
        height: updates.height,
        node_type: updates.nodeType
      };

      // Remove undefined values
      Object.keys(databaseUpdates).forEach(key => 
        databaseUpdates[key] === undefined && delete databaseUpdates[key]
      );

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