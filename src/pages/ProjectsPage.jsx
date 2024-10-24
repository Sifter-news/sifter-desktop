import React from 'react';
import Header from '../components/Header';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../integrations/supabase/supabase';
import InvestigationCard from '../components/InvestigationCard';
import { useToast } from "@/components/ui/use-toast";

const ProjectsPage = () => {
  const { toast } = useToast();
  const user = {
    name: 'User Name',
    avatar: '/default-image.png',
    email: 'user@example.com',
  };

  const { data: investigations = [], isLoading } = useQuery({
    queryKey: ['all-investigations'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('investigation')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          toast({
            title: "Error",
            description: "Failed to fetch investigations",
            variant: "destructive",
          });
          return [];
        }

        return data;
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
        return [];
      }
    },
  });

  return (
    <div className="min-h-screen bg-white">
      <Header user={user} />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-gray-100 rounded-[64px] p-8">
          <h1 className="text-3xl font-bold mb-8">All Projects</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-3 text-center py-8">Loading...</div>
            ) : (
              investigations.map((investigation) => (
                <InvestigationCard
                  key={investigation.id}
                  investigation={investigation}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProjectsPage;