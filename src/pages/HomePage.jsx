import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ProjectList from '../components/views/project/ProjectList';
import ReportModal from '../components/ReportModal';
import ProjectEditModal from '../components/ProjectEditModal';
import { Button } from "@/components/ui/button";
import { PlusIcon, FileSearchIcon } from 'lucide-react';
import { supabase } from '../integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";

const HomePage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
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
        name: session.user.email === 'admin@sifter.news' ? 'Sifter Admin' : session.user.email,
        avatar: '/placeholder.svg',
        email: session.user.email,
      });
    };

    checkSession();
  }, [navigate]);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data: projects, error } = await supabase
        .from('project')
        .select(`
          *,
          nodes:node(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch projects",
          variant: "destructive",
        });
        return;
      }

      // Transform the projects data to match the investigations format
      const transformedProjects = projects.map(project => ({
        ...project,
        reports: project.nodes || [], // Use nodes as reports for now
      }));

      setProjects(transformedProjects);
    };

    if (user) {
      fetchProjects();
    }
  }, [user, toast]);

  const handleProjectClick = (project) => {
    navigate(`/${user.name}/project/${encodeURIComponent(project.title)}`);
  };

  const handleUpdateProject = async (updatedProject) => {
    const { error } = await supabase
      .from('project')
      .update(updatedProject)
      .eq('id', updatedProject.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
      return;
    }

    setProjects(prevProjects =>
      prevProjects.map(proj =>
        proj.id === updatedProject.id ? updatedProject : proj
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
              <h2 className="text-2xl font-bold">Projects</h2>
            </div>
            <Button 
              className="rounded-full w-14 h-14 p-0 flex items-center justify-center"
              onClick={handleAddNewProject}
            >
              <PlusIcon className="h-6 w-6" />
            </Button>
          </div>
          
          <ProjectList 
            projects={projects}
            onUpdateProject={handleUpdateProject}
          />
        </div>
      </div>

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSave={(newReport) => {
          if (projects.length > 0) {
            const updatedProject = {
              ...projects[0],
              reports: [...projects[0].reports, newReport]
            };
            handleUpdateProject(updatedProject);
          }
          setIsReportModalOpen(false);
        }}
      />
      
      {editingProject && (
        <ProjectEditModal
          isOpen={!!editingProject}
          onClose={() => setEditingProject(null)}
          project={editingProject}
          onUpdate={handleUpdateProject}
        />
      )}
    </div>
  );
};

export default HomePage;
