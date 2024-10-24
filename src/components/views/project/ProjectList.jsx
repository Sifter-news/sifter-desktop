import React from 'react';
import ProjectCard from './ProjectCard';

const ProjectList = ({ projects, onEditProject, onDeleteProject }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEditProject}
          onDelete={onDeleteProject}
        />
      ))}
    </div>
  );
};

export default ProjectList;