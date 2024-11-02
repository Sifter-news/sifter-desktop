import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import ProjectTabs from '../components/ProjectTabs';
import ProjectModals from '../components/ProjectModals';
import ContentModal from '../components/ContentModal';
import Toolbar from '@/01_components/05_investigation/viewsControls/Toolbar';
import { useProjectData } from '../hooks/useProjectData';
import { useNodeOperations } from '../components/NodeOperations';
import { useDebug } from '@/contexts/DebugContext';

const ProjectView = () => {
  const { id } = useParams();
  const [selectedContent, setSelectedContent] = useState(null);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [focusedNodeId, setFocusedNodeId] = useState(null);
  const [viewMode, setViewMode] = useState('canvas2d');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const { setDebugData } = useDebug();
  
  const { project, setProject, nodes, setNodes, loading } = useProjectData(id);
  const { handleAddNode, handleUpdateNode, handleDeleteNode } = useNodeOperations(setNodes);

  useEffect(() => {
    setDebugData(prev => ({
      ...prev,
      currentView: viewMode
    }));
  }, [setDebugData, viewMode]);

  const handleViewModeChange = (newMode) => {
    setViewMode(newMode);
  };

  const handleAIChatToggle = () => {
    setIsAIChatOpen(!isAIChatOpen);
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
        user={project.user} 
        projectName={project.title} 
        onProjectClick={() => {}}
      />
      <div className="flex-grow relative">
        <ProjectTabs
          project={project}
          nodes={nodes}
          setNodes={setNodes}
          onAddNode={(node) => handleAddNode(node, id)}
          onUpdateNode={handleUpdateNode}
          onDeleteNode={handleDeleteNode}
          focusedNodeId={focusedNodeId}
          onNodeFocus={setFocusedNodeId}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
        />
        <Toolbar 
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          onAIChatToggle={handleAIChatToggle}
          onAddNode={(node) => handleAddNode(node, id)}
        />
      </div>
      <ProjectModals
        project={project}
        onProjectUpdate={(updatedProject) => setProject(updatedProject)}
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