import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/supabase';
import InvestigationList from '../views/investigations/InvestigationList';
import { useToast } from "@/components/ui/use-toast";

const DashboardContent = ({ user }) => {
  const { toast } = useToast();

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

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[200px]">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-[200px]">Error loading investigations</div>;
  }

  return (
    <InvestigationList 
      investigations={investigations}
      onUpdateInvestigation={async (updatedInvestigation) => {
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
      }}
    />
  );
};

export default DashboardContent;