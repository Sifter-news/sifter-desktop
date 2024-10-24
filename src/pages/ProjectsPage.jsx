import React, { useState } from 'react';
import ProjectHeader from '@/components/views/project/ProjectHeader';
import ProjectList from '@/components/views/project/ProjectList';
import ProjectEditModal from '@/components/ProjectEditModal';
import { useToast } from "@/components/ui/use-toast";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = (projectId) => {
    setProjects(projects.filter(p => p.id !== projectId));
    toast({
      title: "Project deleted",
      description: "The project has been successfully deleted.",
    });
  };

  const handleSaveProject = (project) => {
    if (editingProject) {
      setProjects(projects.map(p => p.id === project.id ? project : p));
      toast({
        title: "Project updated",
        description: "The project has been successfully updated.",
      });
    } else {
      setProjects([...projects, { ...project, id: Date.now() }]);
      toast({
        title: "Project created",
        description: "A new project has been successfully created.",
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <ProjectHeader onCreateProject={handleCreateProject} />
      <ProjectList
        projects={projects}
        onEditProject={handleEditProject}
        onDeleteProject={handleDeleteProject}
      />
      <ProjectEditModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProject}
        project={editingProject}
      />
    </div>
  );
};

export default ProjectsPage;