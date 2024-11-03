import { supabase } from '@/config/supabase';
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
        position_z: newNode.z || 0,
        width: newNode.width || 200,
        height: newNode.height || 100,
        node_type: newNode.nodeType || 'generic'
      };

      const { data, error } = await supabase
        .from('node')
        .insert([nodeData])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        toast.error('Failed to add node');
        return null;
      }

      const nodeWithUI = {
        ...data,
        x: data.position_x,
        y: data.position_y,
        z: data.position_z,
        width: data.width,
        height: data.height,
        visualStyle: data.visual_style,
        nodeType: data.node_type
      };

      setNodes(prevNodes => [...prevNodes, nodeWithUI]);
      toast.success('Node added successfully');
      return nodeWithUI;
    } catch (error) {
      console.error('Error adding node:', error);
      toast.error('Failed to add node');
      return null;
    }
  };

  const handleUpdateNode = async (nodeId, updates) => {
    if (!nodeId) {
      console.error('No node ID provided for update operation');
      return;
    }

    try {
      const databaseUpdates = {
        title: updates.title,
        description: updates.description,
        type: updates.type,
        visual_style: updates.visualStyle,
        position_x: updates.x,
        position_y: updates.y,
        position_z: updates.z,
        width: updates.width,
        height: updates.height,
        node_type: updates.nodeType,
        updated_at: new Date().toISOString()
      };

      // Remove undefined values
      Object.keys(databaseUpdates).forEach(key => 
        databaseUpdates[key] === undefined && delete databaseUpdates[key]
      );

      const { error } = await supabase
        .from('node')
        .update(databaseUpdates)
        .eq('id', nodeId);

      if (error) {
        console.error('Database error:', error);
        toast.error('Failed to update node');
        return;
      }

      setNodes(prevNodes => prevNodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      ));
      
      toast.success('Node updated successfully');
    } catch (error) {
      console.error('Error updating node:', error);
      toast.error('Failed to update node');
    }
  };

  const handleDeleteNode = async (nodeId) => {
    if (!nodeId) {
      console.error('No node ID provided for delete operation');
      return false;
    }

    try {
      const { error } = await supabase
        .from('node')
        .delete()
        .eq('id', nodeId);

      if (error) {
        console.error('Database error:', error);
        toast.error('Failed to delete node');
        return false;
      }

      setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
      toast.success('Node deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting node:', error);
      toast.error('Failed to delete node');
      return false;
    }
  };

  return { handleAddNode, handleUpdateNode, handleDeleteNode };
};