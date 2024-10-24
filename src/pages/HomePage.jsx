import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import InvestigationList from '../components/views/investigations/InvestigationList';
import ReportModal from '../components/ReportModal';
import ProjectEditModal from '../components/ProjectEditModal';
import { Button } from "@/components/ui/button";
import { PlusIcon, FileSearchIcon } from 'lucide-react';
import { supabase } from '../integrations/supabase/supabase';
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from '@tanstack/react-query';

const HomePage = () => {
  const navigate = useNavigate();
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
        id: session.user.id,
        name: session.user.email === 'admin@sifter.news' ? 'Sifter Admin' : session.user.email,
        avatar: '/placeholder.svg',
        email: session.user.email,
      });
    };

    checkSession();
  }, [navigate]);

  const { data: investigations = [], isLoading, error } = useQuery({
    queryKey: ['investigations', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // First, fetch investigations
      const { data: userInvestigations, error: investigationsError } = await supabase
        .from('investigation')
        .select('*')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (investigationsError) {
        toast({
          title: "Error",
          description: "Failed to fetch investigations",
          variant: "destructive",
        });
        return [];
      }

      // Then, for each investigation, fetch its nodes
      const investigationsWithNodes = await Promise.all(
        userInvestigations.map(async (investigation) => {
          const { data: nodes } = await supabase
            .from('node')
            .select('*')
            .eq('investigation_id', investigation.id);
          
          return {
            ...investigation,
            reports: nodes || [],
          };
        })
      );

      return investigationsWithNodes;
    },
    enabled: !!user?.id,
  });

  const handleUpdateInvestigation = async (updatedInvestigation) => {
    const { error } = await supabase
      .from('investigation')
      .update(updatedInvestigation)
      .eq('id', updatedInvestigation.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update investigation",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Investigation updated successfully",
    });
  };

  const handleAddNewProject = () => {
    navigate('/new-project');
  };

  if (!user) {
    return null;
  }

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen">Error loading investigations</div>;
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