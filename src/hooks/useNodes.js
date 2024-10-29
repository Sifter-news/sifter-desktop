import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';

export const useNodes = () => {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const { data, error } = await supabase
          .from('node')
          .select('*');
          
        if (error) throw error;
        
        if (data) {
          const mappedNodes = data.map(node => ({
            id: node.id,
            title: node.title || '',
            description: node.description || '',
            position: [
              node.position_x || 0,
              0,
              node.position_y || 0
            ],
            type: node.type || 'generic',
            visualStyle: node.visual_style || 'default'
          }));
          setNodes(mappedNodes);
        }
      } catch (error) {
        console.error('Error loading nodes:', error);
        toast.error('Failed to load nodes');
      }
    };

    fetchNodes();
  }, []);

  const handleNodeUpdate = async (nodeId, newPosition) => {
    try {
      const { error } = await supabase
        .from('node')
        .update({
          position_x: newPosition[0],
          position_y: newPosition[2]
        })
        .eq('id', nodeId);

      if (error) throw error;

      setNodes(prev => prev.map(node =>
        node.id === nodeId ? { ...node, position: newPosition } : node
      ));
    } catch (error) {
      console.error('Error updating node position:', error);
      toast.error('Failed to update node position');
    }
  };

  return {
    nodes,
    setNodes,
    handleNodeUpdate
  };
};