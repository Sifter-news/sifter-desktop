import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import ProjectTabs from '../components/ProjectTabs';
import ProjectModals from '../components/ProjectModals';
import ReportList from '../components/ReportList';
import ArticleModal from '../components/ArticleModal';
import Toolbar from '../components/Toolbar';
import { findAvailablePosition } from '../utils/canvasUtils';
import { getNodeSchema } from './project/node/nodeSchema';
import { useToast } from "@/components/ui/use-toast";

const ProjectView = () => {
  const { id } = useParams();
  const location = useLocation();
  const { toast } = useToast();
  const [zoom, setZoom] = useState(1);
  
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
  const [activeTool, setActiveTool] = useState('select');

  useEffect(() => {
    if (location.state?.project) {
      const savedNodes = localStorage.getItem(`project_${id}_nodes`);
      if (savedNodes) {
        setNodes(JSON.parse(savedNodes));
      }
    } else if (location.state?.newProject) {
      toast({
        title: "Project Created",
        description: `Project "${location.state.newProject.title}" has been created`,
        duration: 3000,
      });
    }
  }, [id, location.state, toast]);

  useEffect(() => {
    localStorage.setItem(`project_${id}_nodes`, JSON.stringify(nodes));
  }, [id, nodes]);

  const handleProjectUpdate = (updatedProject) => {
    setProject(updatedProject);
    toast({
      title: "Project Updated",
      description: `Project "${updatedProject.title}" has been updated`,
      duration: 3000,
    });
  };

  const handleAddNode = (newNode) => {
    const position = findAvailablePosition(nodes);
    const nodeSchema = getNodeSchema(newNode.type);
    const nodeWithPosition = { ...nodeSchema, ...newNode, x: position.x, y: position.y };
    setNodes(prevNodes => [...prevNodes, nodeWithPosition]);
    toast({
      title: "Node Created",
      description: `New ${newNode.type || 'blank'} node has been created`,
      duration: 3000,
    });
  };

  const handleUpdateNode = (nodeId, updates) => {
    setNodes(prevNodes => {
      const updatedNodes = prevNodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      );
      const updatedNode = updatedNodes.find(node => node.id === nodeId);
      if (updatedNode) {
        toast({
          title: "Node Updated",
          description: `Node "${updatedNode.title || 'Untitled'}" has been updated`,
          duration: 3000,
        });
      }
      return updatedNodes;
    });
  };

  const handleDeleteNode = (nodeId) => {
    const nodeToDelete = nodes.find(node => node.id === nodeId);
    if (nodeToDelete) {
      setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
      toast({
        title: "Node Deleted",
        description: `Node "${nodeToDelete.title || 'Untitled'}" has been deleted`,
        duration: 3000,
        variant: "destructive",
      });
    }
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setIsArticleModalOpen(true);
  };

  const handleZoom = (delta) => {
    setZoom(prevZoom => Math.max(0.1, Math.min(prevZoom + delta, 5)));
  };

  return (
    <div className="min-h-screen bg-[#594BFF] flex flex-col">
      <Header user={user} projectName={project.title} onProjectClick={() => {}} />
      <div className="flex-grow relative">
        <ProjectTabs
          project={project}
          nodes={nodes}
          setNodes={setNodes}
          onAddNode={handleAddNode}
          onUpdateNode={handleUpdateNode}
          onDeleteNode={handleDeleteNode}
        />
        <Toolbar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          handleAIClick={() => {}}
          handleAddNode={handleAddNode}
          handleZoom={handleZoom}
          zoom={zoom}
          nodes={nodes}
        />
      </div>
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
          toast({
            title: "Article Updated",
            description: `Article "${updatedArticle.title || 'Untitled'}" has been updated`,
            duration: 3000,
          });
        }}
      />
    </div>
  );
};

export default ProjectView;