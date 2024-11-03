import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import ProjectTabs from '../components/ProjectTabs';
import ProjectModals from '../components/ProjectModals';
import ContentModal from '../components/ContentModal';
import { useProjectData } from '../hooks/useProjectData';
import { useNodeOperations } from '../components/NodeOperations';
import { useDebug } from '@/contexts/DebugContext';

const ProjectView = () => {
  const { id } = useParams();
  const [selectedContent, setSelectedContent] = useState(null);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [focusedNodeId, setFocusedNodeId] = useState(null);
  const { setDebugData } = useDebug();
  
  const { project, setProject, nodes, setNodes, loading } = useProjectData(id);
  const { handleAddNode, handleUpdateNode, handleDeleteNode } = useNodeOperations(setNodes);

  // Set initial view to canvas2d and update debug data
  useEffect(() => {
    setDebugData(prev => ({
      ...prev,
      currentView: 'canvas2d'
    }));
  }, [setDebugData]);

  const user = {
    name: 'User-Name',
    avatar: '/default-image.png',
    email: 'user@example.com',
  };

  const handleProjectUpdate = (updatedProject) => {
    setProject(updatedProject);
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
        defaultView="canvas2d"
      />
      <ProjectModals
        project={project}
        onProjectUpdate={handleProjectUpdate}
      />
      <ContentModal
        isOpen={isContentModalOpen}
        onClose={() => setIsContentModalOpen(false)}
        content={selectedContent}
        onSave={(updatedContent) => {
          console.log("Content updated:", updatedContent);
          setIsContentModalOpen(false);
        }}
        type="article"
      />
    </div>
  );
};

export default ProjectView;