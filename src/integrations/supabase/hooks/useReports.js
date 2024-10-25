import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

export const useReport = (id) => useQuery({
  queryKey: ['reports', id],
  queryFn: async () => {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  },
  enabled: !!id,
});

export const useReports = (investigationId) => useQuery({
  queryKey: ['reports', { investigationId }],
  queryFn: async () => {
    let query = supabase.from('reports').select('*');
    
    if (investigationId) {
      query = query.eq('investigation_id', investigationId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },
  enabled: true,
});

export const useAddReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newReport) => {
      const { data, error } = await supabase
        .from('reports')
        .insert([newReport])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      if (variables.investigation_id) {
        queryClient.invalidateQueries({ 
          queryKey: ['reports', { investigationId: variables.investigation_id }] 
        });
      }
    },
  });
};

export const useUpdateReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('reports')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      if (variables.investigation_id) {
        queryClient.invalidateQueries({ 
          queryKey: ['reports', { investigationId: variables.investigation_id }] 
        });
      }
    },
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('reports')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};