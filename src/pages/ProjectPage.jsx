import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import ProjectTabs from '../components/ProjectTabs';

const ProjectPage = () => {
  const { username, projectName } = useParams();
  const [project, setProject] = useState(null);
  const [user, setUser] = useState({
    name: username,
    avatar: '/default-image.png',
    email: `${username}@example.com`,
  });

  useEffect(() => {
    // Here you would typically fetch the project data based on the username and projectName
    // For now, we'll use mock data
    setProject({
      id: '1',
      title: projectName,
      description: 'Project description',
      reports: [],
    });
  }, [username, projectName]);

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header user={user} projectName={project.title} onProjectClick={() => {}} />
      <ProjectTabs
        project={project}
        nodes={[]} // You'll need to implement this based on your project structure
        setNodes={() => {}} // You'll need to implement this based on your project structure
        onAddNode={() => {}}
        onUpdateNode={() => {}}
        onDeleteNode={() => {}}
      />
    </div>
  );
};

export default ProjectPage;