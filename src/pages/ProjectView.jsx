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

  const [project, setProject] = useState(location.state?.project || {
    id,
    title: `New Project`,
    description: '',
    reports: []
  });

  const [nodes, setNodes] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

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
        ...newNode, 
        x: position.x, 
        y: position.y,
        investigation_id: id
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
      const { error } = await supabase
        .from('node')
        .update(updates)
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