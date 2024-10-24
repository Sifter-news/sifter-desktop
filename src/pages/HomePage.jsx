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
  const [editingInvestigation, setEditingInvestigation] = useState(null);

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
      
      try {
        const { data: userInvestigations, error: investigationsError } = await supabase
          .from('investigation')
          .select('id, title, description, created_at')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });

        if (investigationsError) {
          console.error('Error fetching investigations:', investigationsError);
          toast({
            title: "Error",
            description: "Failed to fetch investigations",
            variant: "destructive",
          });
          return [];
        }

        // Fetch reports separately for each investigation
        const investigationsWithReports = await Promise.all(
          (userInvestigations || []).map(async (investigation) => {
            const { data: reports, error: reportsError } = await supabase
              .from('report')
              .select('id, title, content, created_at')
              .eq('investigation_id', investigation.id);
            
            if (reportsError) {
              console.error('Error fetching reports:', reportsError);
            }
            
            return {
              ...investigation,
              reports: reports || []
            };
          })
        );

        return investigationsWithReports;
      } catch (error) {
        console.error('Error in query function:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
        return [];
      }
    },
    enabled: !!user?.id,
  });

  const handleUpdateInvestigation = async (updatedInvestigation) => {
    const { error } = await supabase
      .from('investigation')
      .update({
        title: updatedInvestigation.title,
        description: updatedInvestigation.description
      })
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

  const handleAddNewInvestigation = () => {
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
              onClick={() => navigate('/new-project')}
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
        onSave={async (newReport) => {
          if (investigations.length > 0) {
            const { error } = await supabase
              .from('report')
              .insert({
                investigation_id: investigations[0].id,
                title: newReport.title,
                content: newReport.content,
                author_id: user.id
              });

            if (error) {
              toast({
                title: "Error",
                description: "Failed to create report",
                variant: "destructive",
              });
              return;
            }

            toast({
              title: "Success",
              description: "Report created successfully",
            });
          }
          setIsReportModalOpen(false);
        }}
      />
      
      {editingInvestigation && (
        <ProjectEditModal
          isOpen={!!editingInvestigation}
          onClose={() => setEditingInvestigation(null)}
          project={editingInvestigation}
          onUpdate={handleUpdateInvestigation}
        />
      )}
    </div>
  );
};

export default HomePage;