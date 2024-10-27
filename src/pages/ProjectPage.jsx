import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ProjectTabs from '../components/ProjectTabs';

const ProjectPage = () => {
  const { username, projectName } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [user, setUser] = useState({
    name: username,
    avatar: '/default-image.png',
    email: `${username}@example.com`,
  });

  useEffect(() => {
    setProject({
      id: '1',
      title: projectName,
      description: 'Project description',
      reports: [],
    });
  }, [username, projectName]);

  const handleProjectUpdate = ({ title, description }) => {
    setProject(prev => ({
      ...prev,
      title,
      description
    }));
  };

  const handleProjectDelete = () => {
    navigate('/');
  };

  const handleAddReport = (newReport) => {
    setProject(prev => ({
      ...prev,
      reports: [...(prev.reports || []), newReport]
    }));
  };

  const handleUpdateReport = (updatedReport) => {
    setProject(prev => ({
      ...prev,
      reports: prev.reports.map(report => 
        report.id === updatedReport.id ? updatedReport : report
      )
    }));
  };

  const handleDeleteReport = (reportId) => {
    setProject(prev => ({
      ...prev,
      reports: prev.reports.filter(report => report.id !== reportId)
    }));
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        user={user} 
        projectName={project.title} 
        onProjectUpdate={handleProjectUpdate}
        onProjectDelete={handleProjectDelete}
      />
      <ProjectTabs
        project={project}
        nodes={[]}
        setNodes={() => {}}
        onAddNode={() => {}}
        onUpdateNode={() => {}}
        onDeleteNode={() => {}}
        onAddReport={handleAddReport}
        onUpdateReport={handleUpdateReport}
        onDeleteReport={handleDeleteReport}
      />
    </div>
  );
};

export default ProjectPage;