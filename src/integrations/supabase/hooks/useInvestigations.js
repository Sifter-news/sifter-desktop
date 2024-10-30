import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

export const useInvestigation = (id) => useQuery({
  queryKey: ['investigations', id],
  queryFn: async () => {
    if (!id) return null;
    
    // First fetch the investigation
    const { data: investigation, error: investigationError } = await supabase
      .from('investigations')
      .select('*')
      .eq('id', id)
      .single();
      
    if (investigationError) throw investigationError;

    // Then fetch associated reports
    const { data: reports, error: reportsError } = await supabase
      .from('reports')
      .select('*')
      .eq('investigation_id', id);

    if (reportsError) throw reportsError;
    
    return {
      ...investigation,
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
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Investigations query error:', error);
        throw error;
      }
      
      return data || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });
};

export const useAddInvestigation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newInvestigation) => {
      const { data, error } = await supabase
        .from('investigations')
        .insert([newInvestigation])
        .select()
        .single();
          
      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .from('investigations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
          
      if (error) throw error;
      return data;
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
      const { error } = await supabase
        .from('investigations')
        .delete()
        .eq('id', id);
          
      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['investigations'] });
      queryClient.removeQueries({ queryKey: ['investigations', deletedId] });
    },
  });
};