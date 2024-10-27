import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ProjectTabs from '../components/ProjectTabs';
import { useInvestigation, useUpdateInvestigation } from '@/integrations/supabase/hooks/useInvestigations';
import { toast } from 'sonner';

const ProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: project, isLoading } = useInvestigation(id);
  const { mutate: updateInvestigation } = useUpdateInvestigation();

  const handleProjectUpdate = (updatedProject) => {
    updateInvestigation(updatedProject, {
      onSuccess: () => {
        toast.success('Project updated successfully');
      },
      onError: (error) => {
        toast.error('Failed to update project: ' + error.message);
      }
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header 
        project={project}
        onProjectUpdate={handleProjectUpdate}
      />
      <ProjectTabs
        project={project}
        nodes={[]}
        setNodes={() => {}}
        onAddNode={() => {}}
        onUpdateNode={() => {}}
        onDeleteNode={() => {}}
      />
    </div>
  );
};

export default ProjectPage;