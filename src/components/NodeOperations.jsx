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

      console.log('Adding node with data:', nodeData);

      const { data, error } = await supabase
        .from('nodes')  // Changed from 'node' to 'nodes' to match schema
        .insert([nodeData])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        toast.error(`Failed to add node: ${error.message}`);
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
      console.log('Updating node:', nodeId, 'with updates:', updates);

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

      console.log('Prepared database updates:', databaseUpdates);

      const { error } = await supabase
        .from('nodes')  // Changed from 'node' to 'nodes' to match schema
        .update(databaseUpdates)
        .eq('id', nodeId);

      if (error) {
        console.error('Database error:', error);
        toast.error(`Failed to update node: ${error.message}`);
        return;
      }

      setNodes(prevNodes => prevNodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      ));
      
      toast.success('Node updated successfully');
    } catch (error) {
      console.error('Error updating node:', error);
      toast.error(`Failed to update node: ${error.message}`);
    }
  };

  const handleDeleteNode = async (nodeId) => {
    if (!nodeId) {
      console.error('No node ID provided for delete operation');
      return false;
    }

    try {
      const { error } = await supabase
        .from('nodes')  // Changed from 'node' to 'nodes' to match schema
        .delete()
        .eq('id', nodeId);

      if (error) {
        console.error('Database error:', error);
        toast.error(`Failed to delete node: ${error.message}`);
        return false;
      }

      setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
      toast.success('Node deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting node:', error);
      toast.error(`Failed to delete node: ${error.message}`);
      return false;
    }
  };

  return { handleAddNode, handleUpdateNode, handleDeleteNode };
};