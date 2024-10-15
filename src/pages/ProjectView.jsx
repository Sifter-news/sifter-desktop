import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import ProjectTabs from '../components/ProjectTabs';
import ProjectModals from '../components/ProjectModals';
import { saveProjectState, loadProjectState } from '../utils/projectUtils';

const ProjectView = () => {
  const { id } = useParams();
  const location = useLocation();
  const user = {
    name: 'User-Name',
    avatar: '/placeholder.svg',
    email: 'user@example.com',
  };

  const [project, setProject] = useState(location.state?.project || {
    id,
    title: `Project ${id}`,
    description: 'This is a sample project description.',
    reports: []
  });

  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    const savedNodes = loadProjectState(project.id);
    if (savedNodes.length > 0) {
      setNodes(savedNodes);
    }
  }, [project.id]);

  useEffect(() => {
    saveProjectState(project.id, nodes);
  }, [project.id, nodes]);

  const handleProjectUpdate = (updatedProject) => {
    setProject(updatedProject);
  };

  const handleAddNode = (newNode) => {
    setNodes(prevNodes => [...prevNodes, newNode]);
  };

  const handleUpdateNode = (updatedNode) => {
    setNodes(prevNodes => prevNodes.map(node => 
      node.id === updatedNode.id ? updatedNode : node
    ));
  };

  const handleDeleteNode = (nodeId) => {
    setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
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
    </div>
  );
};

export default ProjectView;