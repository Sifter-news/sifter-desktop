import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

export const useInvestigation = (id) => useQuery({
  queryKey: ['investigations', id],
  queryFn: async () => {
    if (!id) return null;
    
    const { data, error } = await supabase
      .from('investigations')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      console.error('Investigation query error:', error);
      throw error;
    }

    // Get reports in a separate query
    const { data: reports, error: reportsError } = await supabase
      .from('reports')
      .select('*')
      .eq('investigation_id', id);

    if (reportsError) {
      console.error('Reports query error:', reportsError);
      throw reportsError;
    }
    
    return {
      ...data,
      reports: reports || []
    };
  },
  enabled: !!id,
});

export const useInvestigations = ({ select, filter } = {}) => {
  return useQuery({
    queryKey: ['investigations', { select, filter }],
    queryFn: async () => {
      let query = supabase
        .from('investigations')
        .select('*');
      
      if (filter?.startsWith('owner_id.eq.')) {
        const userId = filter.replace('owner_id.eq.', '');
        if (userId && userId !== 'undefined') {
          query = query.eq('owner_id', userId);
        }
      }
      
      const { data: investigations, error } = await query;
      
      if (error) {
        console.error('Investigations query error:', error);
        throw error;
      }

      // Get all reports in a single query
      const { data: reports, error: reportsError } = await supabase
        .from('reports')
        .select('*')
        .in('investigation_id', investigations.map(inv => inv.id));

      if (reportsError) {
        console.error('Reports query error:', reportsError);
        throw reportsError;
      }

      // Attach reports to their respective investigations
      const investigationsWithReports = investigations.map(investigation => ({
        ...investigation,
        reports: reports?.filter(report => report.investigation_id === investigation.id) || []
      }));
      
      return investigationsWithReports || [];
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
