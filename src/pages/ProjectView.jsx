import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '../components/Header';
import ProjectTabs from '../components/ProjectTabs';
import ProjectModals from '../components/ProjectModals';
import ContentModal from '../components/ContentModal';
import { useProjectData } from '../hooks/useProjectData';
import { useNodeOperations } from '../components/NodeOperations';
import { useDebug } from '@/contexts/DebugContext';
import { useAuth } from '@/components/AuthProvider';

const ProjectView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedContent, setSelectedContent] = useState(null);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [focusedNodeId, setFocusedNodeId] = useState(null);
  const { setDebugData } = useDebug();
  
  const { project, setProject, nodes, setNodes, loading } = useProjectData(id);
  const { handleAddNode, handleUpdateNode, handleDeleteNode } = useNodeOperations(setNodes);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    setDebugData(prev => ({
      ...prev,
      currentView: 'mindmap'
    }));
  }, [user, navigate, setDebugData]);

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Project not found</h2>
          <p className="mt-2 text-gray-600">The project you're looking for doesn't exist or you don't have access to it.</p>
        </div>
      </div>
    );
  }

  const handleProjectUpdate = (updatedProject) => {
    setProject(updatedProject);
    toast.success('Project updated successfully');
  };

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
        defaultView="mindmap"
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