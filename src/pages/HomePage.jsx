import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import InvestigationList from '../components/views/investigations/InvestigationList';
import ReportModal from '../components/ReportModal';
import ProjectEditModal from '../components/ProjectEditModal';
import { Button } from "@/components/ui/button";
import { PlusIcon, FileSearchIcon } from 'lucide-react';
import { supabase } from '../integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [investigations, setInvestigations] = useState([]);
  const [user, setUser] = useState(null);
  const { toast } = useToast();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/login');
        return;
      }
      setUser({
        name: session.user.user_metadata.full_name || 'John Ferreira',
        avatar: '/placeholder.svg',
        email: session.user.email,
      });
    };

    checkSession();
  }, [navigate]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data: projects, error } = await supabase
        .from('project')  // Changed from 'projects' to 'project'
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch projects",
          variant: "destructive",
        });
        return;
      }

      setInvestigations(projects);
    };

    if (user) {
      fetchProjects();
    }
  }, [user, toast]);

  const handleProjectClick = (project) => {
    const username = 'john.ferreira';
    navigate(`/${username}/project/${encodeURIComponent(project.title)}`);
  };

  const handleUpdateInvestigation = async (updatedInvestigation) => {
    const { error } = await supabase
      .from('project')  // Changed from 'projects' to 'project'
      .update(updatedInvestigation)
      .eq('id', updatedInvestigation.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
      return;
    }

    setInvestigations(prevInvestigations =>
      prevInvestigations.map(inv =>
        inv.id === updatedInvestigation.id ? updatedInvestigation : inv
      )
    );
  };

  const handleAddNewProject = () => {
    navigate('/new-project');
  };

  if (!user) {
    return null;
  }

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
              <h2 className="text-2xl font-bold">Investigations</h2>
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
            onUpdateInvestigation={handleUpdateInvestigation}
          />
        </div>
      </div>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSave={(newReport) => {
          if (investigations.length > 0) {
            const updatedInvestigation = {
              ...investigations[0],
              reports: [...investigations[0].reports, newReport]
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
          project={editingProject}
          onUpdate={handleUpdateInvestigation}
        />
      )}
    </div>
  );
};

export default HomePage;
