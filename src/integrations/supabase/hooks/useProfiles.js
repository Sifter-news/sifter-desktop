import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';

/*
### profiles

| name                    | type      | format  | required |
|------------------------|-----------|---------|----------|
| id                     | uuid      | uuid    | true     |
| username               | varchar   | string  | true     |
| email                  | varchar   | string  | false    |
| created_at             | timestamp | string  | false    |
| subscription_plan_id   | uuid      | uuid    | false    |
| subscription_start_date| timestamp | string  | false    |
| subscription_end_date  | timestamp | string  | false    |

Foreign Key Relationships:
- subscription_plan_id references subscription_plans.id
*/

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const useProfile = (id) => useQuery({
  queryKey: ['profiles', id],
  queryFn: () => fromSupabase(
    supabase.from('profiles').select('*').eq('id', id).single()
  ),
  enabled: !!id
});

export const useProfiles = () => useQuery({
  queryKey: ['profiles'],
  queryFn: () => fromSupabase(
    supabase.from('profiles').select('*')
  )
});

export const useAddProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newProfile) => {
      const { data, error } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.setQueryData(['profiles', data.id], data);
    }
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.setQueryData(['profiles', data.id], data);
    }
  });
};

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.removeQueries({ queryKey: ['profiles', deletedId] });
    }
  });
};