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
          // Ensure we only store serializable data
          const serializedProject = {
            id: data.id,
            title: data.title || '',
            description: data.description || '',
            created_at: data.created_at || new Date().toISOString(),
            updated_at: data.updated_at || new Date().toISOString(),
            user_id: data.user_id || '',
            reports: []
          };
          setProject(serializedProject);
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
          .select('id, title, description, type, investigation_id')
          .eq('investigation_id', id);
          
        if (error) throw error;
        
        if (data) {
          // Ensure we only store serializable data and center nodes
          const serializedNodes = data.map(node => ({
            id: node.id,
            title: node.title || '',
            description: node.description || '',
            type: node.type || 'generic',
            investigation_id: node.investigation_id,
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            width: 200,
            color: 'bg-yellow-200'
          }));
          setNodes(serializedNodes);
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