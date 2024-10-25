import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

export const useInvestigation = (id) => useQuery({
  queryKey: ['investigations', id],
  queryFn: async () => {
    const { data: investigation, error: investigationError } = await supabase
      .from('investigations')
      .select('*')
      .eq('id', id)
      .single();
      
    if (investigationError) throw investigationError;

    // Fetch associated reports separately
    const { data: reports, error: reportsError } = await supabase
      .from('reports')
      .select('*')
      .eq('investigation_id', id);

    if (reportsError) throw reportsError;

    return { ...investigation, reports: reports || [] };
  },
  enabled: !!id,
});

export const useInvestigations = ({ select, filter } = {}) => {
  return useQuery({
    queryKey: ['investigations', { select, filter }],
    queryFn: async () => {
      try {
        // First fetch investigations
        let query = supabase
          .from('investigations')
          .select('*');
        
        if (filter?.startsWith('owner_id.eq.')) {
          const userId = filter.replace('owner_id.eq.', '');
          if (userId && userId !== 'undefined') {
            query = query.eq('owner_id', userId);
          }
        }
        
        const { data: investigations, error: investigationsError } = await query;
        if (investigationsError) throw investigationsError;

        // Then fetch all reports for these investigations
        const investigationIds = investigations.map(inv => inv.id);
        const { data: reports, error: reportsError } = await supabase
          .from('reports')
          .select('*')
          .in('investigation_id', investigationIds);

        if (reportsError) throw reportsError;

        // Combine investigations with their reports
        const investigationsWithReports = investigations.map(investigation => ({
          ...investigation,
          reports: reports?.filter(report => report.investigation_id === investigation.id) || []
        }));

        return investigationsWithReports || [];
      } catch (error) {
        console.error('Investigation query error:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });
};

export const useAddInvestigation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newInvestigation) => {
      try {
        const { data, error } = await supabase
          .from('investigations')
          .insert([newInvestigation])
          .select()
          .single();
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Add investigation error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investigations'] });
    },
  });
};

export const useUpdateInvestigation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      try {
        const { data, error } = await supabase
          .from('investigations')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Update investigation error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investigations'] });
    },
  });
};

export const useDeleteInvestigation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      try {
        const { error } = await supabase
          .from('investigations')
          .delete()
          .eq('id', id);
          
        if (error) throw error;
        return id;
      } catch (error) {
        console.error('Delete investigation error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investigations'] });
    },
  });
};