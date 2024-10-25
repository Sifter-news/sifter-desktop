import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';

export const useProjectData = (id) => {
  const [project, setProject] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const { data, error } = await supabase
          .from('investigations')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setProject({
            ...data,
            reports: []
          });
        }
      } catch (error) {
        console.error('Error loading project:', error);
        toast.error('Failed to load project');
      }
    };

    const loadNodes = async () => {
      try {
        const { data, error } = await supabase
          .from('node')
          .select('id, title, description, type, investigation_id, position_x, position_y, width')
          .eq('investigation_id', id);
          
        if (error) throw error;
        
        if (data) {
          // Map position_x and position_y to x and y for frontend compatibility
          const mappedNodes = data.map(node => ({
            ...node,
            x: node.position_x,
            y: node.position_y
          }));
          setNodes(mappedNodes);
        }
      } catch (error) {
        console.error('Error loading nodes:', error);
        toast.error('Failed to load nodes');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProject();
      loadNodes();
    }
  }, [id]);

  return { project, setProject, nodes, setNodes, loading };
};