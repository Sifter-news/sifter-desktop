import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '../components/Header';
import InvestigationCard from '../components/InvestigationCard';
import ReportCard from '../components/ReportCard';
import { Button } from "@/components/ui/button";
import { PlusIcon, FileSearchIcon, MoreVertical, Pencil, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReportModal from '../components/ReportModal';
import ProjectEditModal from '../components/ProjectEditModal';
import { useInvestigations, useAddInvestigation, useUpdateInvestigation, useDeleteInvestigation } from '@/integrations/supabase/index';
import { supabase } from '@/integrations/supabase/supabase';

const HomePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
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
      view_type: 'mind'
    };

    addInvestigation(newProject, {
      onSuccess: (data) => {
        toast.success('Project created successfully');
        navigate(`/project/${data[0].id}`);
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
              <h2 className="text-2xl font-bold">My Investigations</h2>
            </div>
            <Button 
              className="rounded-full w-14 h-14 p-0 flex items-center justify-center"
              onClick={handleAddNewProject}
            >
              <PlusIcon className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex-grow overflow-y-auto scrollbar-hide">
            <div className="flex flex-col space-y-6">
              {investigations?.map((investigation) => (
                <div key={investigation.id} className="flex flex-col lg:flex-row w-full">
                  <div className="w-full lg:w-1/2 flex-shrink-0 relative">
                    <div onClick={() => handleProjectClick(investigation)}>
                      <InvestigationCard 
                        investigation={investigation} 
                        onUpdateInvestigation={handleUpdateInvestigation}
                      />
                    </div>
                    <div className="absolute top-2 right-2 z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/20">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setEditingProject(investigation)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Rename</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => handleDeleteInvestigation(investigation.id)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <div className="w-full lg:w-1/2 flex-shrink-0">
                    <div className="bg-white bg-opacity-30 rounded-r-lg p-4 h-full relative overflow-hidden">
                      <div className="overflow-x-auto h-full scrollbar-hide">
                        <div className="flex space-x-4 h-full pb-4">
                          {investigation.reports?.map(report => (
                            <div key={report.id} className="w-64 flex-shrink-0">
                              <ReportCard 
                                report={report} 
                                onUpdate={(updatedReport) => {
                                  const updatedReports = investigation.reports.map(r =>
                                    r.id === updatedReport.id ? updatedReport : r
                                  );
                                  handleUpdateInvestigation({
                                    ...investigation,
                                    reports: updatedReports
                                  });
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white to-transparent pointer-events-none"></div>
                      <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                      <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-white to-transparent pointer-events-none"></div>
                      <div className="absolute inset-y-0 right-0 w-4 bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSave={(newReport) => {
          if (investigations?.length > 0) {
            const updatedInvestigation = {
              ...investigations[0],
              reports: [...(investigations[0].reports || []), newReport]
            };
            handleUpdateInvestigation(updatedInvestigation);
          }
          setIsReportModalOpen(false);
        }}
      />
      {editingProject && (
        <ProjectEditModal
          isOpen={!!editingProject}
          onClose={() => setEditingProject(null)}
          projectName={editingProject.title}
          description={editingProject.description}
          onUpdate={(updates) => handleUpdateInvestigation({ ...editingProject, ...updates })}
          onDelete={() => handleDeleteInvestigation(editingProject.id)}
        />
      )}
    </div>
  );
};

export default HomePage;
