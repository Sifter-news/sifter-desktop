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
          // Generate random positions for nodes in the viewport
          const serializedNodes = data.map((node, index) => ({
            ...node,
            x: (index % 3) * 250 + 100,  // Arrange in a grid, 3 columns
            y: Math.floor(index / 3) * 250 + 100,  // New row every 3 nodes
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