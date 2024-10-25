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
          .select('id, title, description, type, investigation_id, x, y, width')
          .eq('investigation_id', id);
          
        if (error) throw error;
        
        if (data) {
          setNodes(data.map(node => ({
            ...node,
            x: node.x || 0,
            y: node.y || 0,
            width: node.width || 200,
          })));
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