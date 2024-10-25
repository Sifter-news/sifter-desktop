import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import ProjectTabs from '../components/ProjectTabs';
import ProjectModals from '../components/ProjectModals';
import ReportList from '../components/ReportList';
import ArticleModal from '../components/ArticleModal';
import { findAvailablePosition } from '../utils/canvasUtils';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';

const ProjectView = () => {
  const { id } = useParams();
  const location = useLocation();
  const user = {
    name: 'User-Name',
    avatar: '/default-image.png',
    email: 'user@example.com',
  };

  const [project, setProject] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

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

    if (id) {
      loadProject();
    }
  }, [id]);

  useEffect(() => {
    const loadNodes = async () => {
      try {
        const { data, error } = await supabase
          .from('node')
          .select('*')
          .eq('investigation_id', id);
          
        if (error) throw error;
        
        if (data) {
          setNodes(data.map(node => ({
            ...node,
            x: node.x || 0,
            y: node.y || 0,
            width: node.width || 200,
            height: node.height || 200,
          })));
        }
      } catch (error) {
        console.error('Error loading nodes:', error);
        toast.error('Failed to load nodes');
      }
    };

    if (id) {
      loadNodes();
    }
  }, [id]);

  const handleProjectUpdate = (updatedProject) => {
    setProject(updatedProject);
  };

  const handleAddNode = async (newNode) => {
    try {
      const position = findAvailablePosition(nodes);
      const nodeWithPosition = {
        title: newNode.title,
        description: newNode.description,
        type: newNode.type,
        investigation_id: id,
        x: position.x,
        y: position.y,
        width: newNode.width || 200,
        height: newNode.height || 200
      };

      const { data, error } = await supabase
        .from('node')
        .insert([nodeWithPosition])
        .select()
        .single();

      if (error) throw error;

      setNodes(prevNodes => [...prevNodes, data]);
      toast.success('Node added successfully');
    } catch (error) {
      console.error('Error adding node:', error);
      toast.error('Failed to add node');
    }
  };

  const handleUpdateNode = async (nodeId, updates) => {
    try {
      // Only update the allowed columns
      const validUpdates = {
        title: updates.title,
        description: updates.description,
        x: updates.x,
        y: updates.y,
        width: updates.width,
        height: updates.height
      };

      const { error } = await supabase
        .from('node')
        .update(validUpdates)
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

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setIsArticleModalOpen(true);
  };

  if (!project) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header user={user} projectName={project.title} onProjectClick={() => {}} />
      <ProjectTabs
        project={project}
        nodes={nodes}
        setNodes={setNodes}
        onAddNode={handleAddNode}
        onUpdateNode={handleUpdateNode}
        onDeleteNode={handleDeleteNode}
      />
      <ProjectModals
        project={project}
        onProjectUpdate={handleProjectUpdate}
      />
      <ReportList
        reports={project.reports}
        onAddReport={handleAddNode}
        onEditReport={handleArticleClick}
      />
      <ArticleModal
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        article={selectedArticle}
        onUpdate={(updatedArticle) => {
          console.log("Article updated:", updatedArticle);
        }}
      />
    </div>
  );
};

export default ProjectView;