import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

export const useInvestigation = (id) => useQuery({
  queryKey: ['investigations', id],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('investigations')
      .select(`
        *,
        reports (*)
      `)
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },
  enabled: !!id,
});

export const useInvestigations = ({ select, filter } = {}) => {
  return useQuery({
    queryKey: ['investigations', { select, filter }],
    queryFn: async () => {
      try {
        let query = supabase
          .from('investigations')
          .select(`
            *,
            reports (*)
          `);
        
        if (filter?.startsWith('owner_id.eq.')) {
          const userId = filter.replace('owner_id.eq.', '');
          if (userId && userId !== 'undefined') {
            query = query.eq('owner_id', userId);
          }
        }
        
        const { data, error } = await query;
        if (error) throw error;
        return data || [];
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
      // Update the investigations list query
      queryClient.invalidateQueries({ queryKey: ['investigations'] });
      
      // Update the individual investigation query
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