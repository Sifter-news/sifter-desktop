import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';

/*
### investigations

| name              | type      | format  | required |
|-------------------|-----------|---------|----------|
| id                | uuid      | uuid    | true     |
| title             | varchar   | string  | true     |
| description       | text      | string  | false    |
| owner_id          | uuid      | uuid    | false    |
| created_at        | timestamp | string  | false    |
| visibility        | varchar   | string  | false    |
| view_type         | varchar   | string  | false    |
| investigation_type| varchar   | string  | false    |

Foreign Key Relationships:
- owner_id references profiles.id
*/

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const useInvestigation = (id) => useQuery({
  queryKey: ['investigations', id],
  queryFn: () => fromSupabase(
    supabase.from('investigations').select('*').eq('id', id).single()
  ),
  enabled: !!id
});

export const useInvestigations = ({ select, filter } = {}) => useQuery({
  queryKey: ['investigations', { select, filter }],
  queryFn: () => {
    let query = supabase.from('investigations').select('*');
    
    if (filter?.startsWith('owner_id.eq.')) {
      const userId = filter.replace('owner_id.eq.', '');
      if (userId && userId !== 'undefined') {
        query = query.eq('owner_id', userId);
      }
    }
    
    return fromSupabase(query);
  }
});

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investigations'] });
    }
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['investigations'] });
      queryClient.setQueryData(['investigations', data.id], data);
    }
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
    }
  });
};