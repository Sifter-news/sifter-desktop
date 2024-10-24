import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ProjectList from './components/views/project/ProjectList';
import { Button } from "@/components/ui/button";
import { PlusIcon } from 'lucide-react';
import { supabase } from '../integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";

const HomePage = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const { toast } = useToast();

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

      setProjects(projects);
    };

    if (user) {
      fetchProjects();
    }
  }, [user, toast]);

  const handleEditProject = (project) => {
    navigate(`/project/${project.id}`);
  };

  const handleDeleteProject = async (projectId) => {
    const { error } = await supabase
      .from('project')
      .delete()
      .eq('id', projectId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
      return;
    }

    setProjects(prev => prev.filter(p => p.id !== projectId));
    toast({
      title: "Success",
      description: "Project deleted successfully",
    });
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
            <h2 className="text-2xl font-bold">My Projects</h2>
            <Button 
              className="rounded-full"
              onClick={handleAddNewProject}
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
          
          <ProjectList 
            projects={projects}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;