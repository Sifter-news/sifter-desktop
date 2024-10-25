import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import ProjectTabs from '../components/ProjectTabs';
import ProjectModals from '../components/ProjectModals';
import ReportList from '../components/ReportList';
import ArticleModal from '../components/ArticleModal';
import { findAvailablePosition } from '../utils/canvasUtils';

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
    if (location.state?.project) {
      const savedNodes = localStorage.getItem(`project_${id}_nodes`);
      if (savedNodes) {
        try {
          setNodes(JSON.parse(savedNodes));
        } catch (error) {
          console.error('Error loading nodes:', error);
          setNodes([]);
        }
      }
    }
  }, [id, location.state]);

  useEffect(() => {
    const safeNodes = nodes.map(node => ({
      id: node.id,
      type: node.type,
      x: node.x,
      y: node.y,
      text: node.text,
      title: node.title,
      width: node.width,
      height: node.height,
      color: node.color,
    }));

    try {
      localStorage.setItem(`project_${id}_nodes`, JSON.stringify(safeNodes));
    } catch (error) {
      console.error('Error saving nodes:', error);
    }
  }, [id, nodes]);

  const handleProjectUpdate = (updatedProject) => {
    setProject(updatedProject);
  };

  const handleAddNode = (newNode) => {
    const position = findAvailablePosition(nodes);
    const nodeWithPosition = { ...newNode, x: position.x, y: position.y };
    setNodes(prevNodes => [...prevNodes, nodeWithPosition]);
  };

  const handleUpdateNode = (nodeId, updates) => {
    setNodes(prevNodes => prevNodes.map(node => 
      node.id === nodeId ? { ...node, ...updates } : node
    ));
  };

  const handleDeleteNode = (nodeId) => {
    setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
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