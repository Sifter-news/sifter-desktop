import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/supabase';
import InvestigationCard from '../InvestigationCard';
import { useToast } from "@/components/ui/use-toast";

const staticInvestigations = [
  {
    id: '1',
    title: 'Human Survival Needs',
    description: 'An investigation into the essential elements required for human survival, including physiological needs, safety, and psychological well-being.',
    reports: [
      { id: '1', title: 'Basic Physiological Needs', content: 'Humans require air, water, food, shelter, and sleep to survive...' },
      { id: '2', title: 'Safety and Security', content: 'Beyond basic physiological needs, humans require safety and security...' },
      { id: '3', title: 'Psychological Well-being', content: 'Mental health is crucial for human survival...' },
      { id: '4', title: 'Environmental Adaptations', content: 'How humans adapt to various environments...' },
      { id: '5', title: 'Long-term Sustainability', content: 'Exploring sustainable practices for long-term human survival...' },
      { id: '6', title: 'Social Connections', content: 'The importance of social bonds in human survival...' }
    ]
  },
  {
    id: '2',
    title: 'Climate Change Impact',
    description: 'A comprehensive study of climate change effects on global ecosystems and human societies.',
    reports: [
      { id: '7', title: 'Rising Sea Levels', content: 'Analysis of coastal impacts and predictions...' },
      { id: '8', title: 'Extreme Weather Events', content: 'Tracking the increase in natural disasters...' },
      { id: '9', title: 'Biodiversity Loss', content: 'Species extinction rates and ecosystem disruption...' },
      { id: '10', title: 'Agricultural Changes', content: 'Impact on global food production...' },
      { id: '11', title: 'Mitigation Strategies', content: 'Current and proposed solutions...' },
      { id: '12', title: 'Economic Implications', content: 'Financial impact of climate change...' }
    ]
  },
  {
    id: '3',
    title: 'AI Ethics Research',
    description: 'Investigating ethical considerations in artificial intelligence development and deployment.',
    reports: [
      { id: '13', title: 'Bias in AI Systems', content: 'Examining sources and impacts of AI bias...' },
      { id: '14', title: 'Privacy Concerns', content: 'Data collection and user privacy issues...' },
      { id: '15', title: 'Job Displacement', content: 'Impact of AI on employment...' },
      { id: '16', title: 'Decision Transparency', content: 'Understanding AI decision-making processes...' },
      { id: '17', title: 'Safety Protocols', content: 'Ensuring safe AI development...' },
      { id: '18', title: 'Future Governance', content: 'Proposed frameworks for AI regulation...' }
    ]
  }
];

const DashboardContent = ({ user }) => {
  const { toast } = useToast();

  const { data: investigations = staticInvestigations, isLoading } = useQuery({
    queryKey: ['investigations', user?.id],
    queryFn: async () => {
      if (!user?.id) return staticInvestigations;
      
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
          return staticInvestigations;
        }

        return userInvestigations || staticInvestigations;
      } catch (error) {
        console.error('Error in query function:', error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
        return staticInvestigations;
      }
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-[200px]">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {investigations.map((investigation) => (
        <InvestigationCard
          key={investigation.id}
          investigation={investigation}
        />
      ))}
    </div>
  );
};

export default DashboardContent;
