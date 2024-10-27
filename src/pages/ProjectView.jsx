import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import ProjectTabs from '../components/ProjectTabs';
import ProjectModals from '../components/ProjectModals';
import ArticleModal from '../components/ArticleModal';
import { useProjectData } from '../hooks/useProjectData';
import { useNodeOperations } from '../components/NodeOperations';

const ProjectView = () => {
  const { id } = useParams();
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [focusedNodeId, setFocusedNodeId] = useState(null);
  
  const { project, setProject, nodes, setNodes, loading } = useProjectData(id);
  const { handleAddNode, handleUpdateNode, handleDeleteNode } = useNodeOperations(setNodes);

  const user = {
    name: 'User-Name',
    avatar: '/default-image.png',
    email: 'user@example.com',
  };

  const handleProjectUpdate = (updatedProject) => {
    setProject(updatedProject);
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setIsArticleModalOpen(true);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!project) {
    return <div className="flex items-center justify-center h-screen">Project not found</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        user={user} 
        projectName={project.title} 
        onProjectClick={() => {}}
      />
      <ProjectTabs
        project={project}
        nodes={nodes}
        setNodes={setNodes}
        onAddNode={(node) => handleAddNode(node, id)}
        onUpdateNode={handleUpdateNode}
        onDeleteNode={handleDeleteNode}
        focusedNodeId={focusedNodeId}
        onNodeFocus={setFocusedNodeId}
      />
      <ProjectModals
        project={project}
        onProjectUpdate={handleProjectUpdate}
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