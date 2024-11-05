import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '../components/Header';
import InvestigationList from '../components/InvestigationList';
import { Button } from "@/components/ui/button";
import { PlusIcon, FileSearchIcon } from 'lucide-react';
import ContentModal from '@/01_components/01_global/Modals/ContentModal';
import InvestigationModal from '@/01_components/01_global/Modals/InvestigationModal';
import { useInvestigations, useAddInvestigation, useUpdateInvestigation, useDeleteInvestigation } from '@/integrations/supabase/index';
import { supabase } from '@/config/supabase';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const { data: investigations, isLoading, error } = useInvestigations({
    select: '*, reports(*)',
    filter: user ? `owner_id.eq.${user.id}` : undefined,
  });
  
  const { mutate: addInvestigation } = useAddInvestigation();
  const { mutate: updateInvestigation } = useUpdateInvestigation();
  const { mutate: deleteInvestigation } = useDeleteInvestigation();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
      } else {
        setUser(user);
      }
    };

    checkUser();
  }, [navigate]);

  const handleProjectClick = (project) => {
    navigate(`/project/${project.id}`);
  };

  const handleUpdateInvestigation = (updatedInvestigation) => {
    updateInvestigation(updatedInvestigation, {
      onSuccess: () => {
        toast.success('Investigation updated successfully');
        setEditingProject(null);
      },
      onError: (error) => {
        toast.error('Failed to update investigation: ' + error.message);
      }
    });
  };

  const handleDeleteInvestigation = (projectId) => {
    deleteInvestigation(projectId, {
      onSuccess: () => {
        toast.success('Investigation deleted successfully');
      },
      onError: (error) => {
        toast.error('Failed to delete investigation: ' + error.message);
      }
    });
  };

  const handleAddNewProject = () => {
    const newProject = {
      title: 'New Project',
      description: '',
      owner_id: user.id,
      visibility: 'private',
      view_type: 'mind',
      investigation_type: 'generic'
    };

    addInvestigation(newProject, {
      onSuccess: (data) => {
        toast.success('Project created successfully');
        navigate(`/project/${data.id}`);
      },
      onError: (error) => {
        toast.error('Failed to create project: ' + error.message);
      }
    });
  };

  if (!user) return null;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header user={user} />
      <div className="flex-grow container mx-auto px-4 py-8 flex flex-col">
        <div className="bg-gray-100 rounded-[64px] p-8 overflow-hidden shadow-inner flex-grow flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <FileSearchIcon className="h-4 w-4 text-gray-600" />
              </div>
              <h2 className="text-base font-normal">Investigations</h2>
            </div>
            <Button 
              className="rounded-full w-14 h-14 p-0 flex items-center justify-center"
              onClick={handleAddNewProject}
            >
              <PlusIcon className="h-6 w-6" />
            </Button>
          </div>
          
          <InvestigationList 
            investigations={investigations}
            onProjectClick={handleProjectClick}
            onEditProject={setEditingProject}
            onDeleteProject={handleDeleteInvestigation}
            onUpdateInvestigation={handleUpdateInvestigation}
          />
        </div>
      </div>

      {editingProject && (
        <InvestigationModal
          isOpen={!!editingProject}
          onClose={() => setEditingProject(null)}
          investigation={editingProject}
          onUpdate={handleUpdateInvestigation}
          onDelete={handleDeleteInvestigation}
        />
      )}
    </div>
  );
};

export default HomePage;