import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

export const useInvestigation = (id) => useQuery({
  queryKey: ['investigations', id],
  queryFn: async () => {
    try {
      // First fetch the investigation
      const { data: investigation, error: investigationError } = await supabase
        .from('investigations')
        .select('*')
        .eq('id', id)
        .single();
        
      if (investigationError) throw investigationError;

      // Then fetch associated reports separately
      const { data: reports, error: reportsError } = await supabase
        .from('reports')
        .select('*')
        .eq('investigation_id', id);
        
      if (reportsError) throw reportsError;

      return {
        ...investigation,
        reports: reports || []
      };
    } catch (error) {
      console.error('Investigation query error:', error);
      throw error;
    }
  },
  enabled: !!id,
});

export const useInvestigations = ({ select, filter } = {}) => {
  return useQuery({
    queryKey: ['investigations', { select, filter }],
    queryFn: async () => {
      try {
        // First fetch investigations
        let query = supabase.from('investigations').select('*');
        
        if (filter?.startsWith('owner_id.eq.')) {
          const userId = filter.replace('owner_id.eq.', '');
          if (userId && userId !== 'undefined') {
            query = query.eq('owner_id', userId);
          }
        }
        
        const { data: investigations, error: investigationsError } = await query;
        if (investigationsError) throw investigationsError;

        // Then fetch all reports
        const { data: reports, error: reportsError } = await supabase
          .from('reports')
          .select('*');
        if (reportsError) throw reportsError;

        // Combine investigations with their reports
        return (investigations || []).map(investigation => ({
          ...investigation,
          reports: reports.filter(report => report.investigation_id === investigation.id) || []
        }));
      } catch (error) {
        console.error('Investigations query error:', error);
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
          .select(`
            *,
            reports (*)
          `)
          .single();
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Add investigation error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['investigations'] });
      return data;
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
          .select(`
            *,
            reports (*)
          `)
          .single();
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error('Update investigation error:', error);
        throw error;
      }
    },
    onSuccess: (updatedInvestigation) => {
      queryClient.invalidateQueries({ queryKey: ['investigations'] });
      queryClient.setQueryData(
        ['investigations', updatedInvestigation.id],
        updatedInvestigation
      );
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
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['investigations'] });
      queryClient.removeQueries({ queryKey: ['investigations', deletedId] });
    },
  });
};