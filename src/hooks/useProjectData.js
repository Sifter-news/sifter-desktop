import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import { useDebug } from '@/contexts/DebugContext';

export const useProjectData = (id) => {
  const [project, setProject] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setDebugData } = useDebug();

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
          .select('*')
          .eq('investigation_id', id);
          
        if (error) throw error;
        
        if (data) {
          const serializedNodes = data.map(node => ({
            id: node.id,
            title: node.title || '',
            description: node.description || '',
            type: node.type || 'generic',
            investigation_id: node.investigation_id,
            x: node.position_x || 0,
            y: node.position_y || 0,
            z: node.position_z || 0,
            width: node.width || 200,
            height: node.height || 100,
            visualStyle: node.visual_style || 'default',
            nodeType: node.node_type || 'generic',
            parent_id: node.parent_id || null
          }));
          setNodes(serializedNodes);
          
          // Update debug data
          setDebugData(prev => ({
            ...prev,
            nodes: {
              count: serializedNodes.length,
              list: serializedNodes
            },
            navigatorNodes: serializedNodes
          }));
          
          console.log('Nodes loaded:', serializedNodes);
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
  }, [id, setDebugData]);

  return { project, setProject, nodes, setNodes, loading };
};