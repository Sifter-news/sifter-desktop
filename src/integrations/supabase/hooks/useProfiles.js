import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

/*
### profiles

| name                    | type      | format    | required |
|------------------------|-----------|-----------|----------|
| id                     | uuid      | string    | true     |
| username               | varchar   | string    | true     |
| email                  | varchar   | string    | false    |
| created_at             | timestamp | string    | false    |
| subscription_plan_id   | uuid      | string    | false    |
| subscription_start_date| timestamp | string    | false    |
| subscription_end_date  | timestamp | string    | false    |

Foreign Key Relationships:
- subscription_plan_id references subscription_plans.id
*/

export const useProfile = (id) => useQuery({
  queryKey: ['profiles', id],
  queryFn: () => fromSupabase(supabase.from('profiles').select('*').eq('id', id).single()),
});

export const useProfiles = () => useQuery({
  queryKey: ['profiles'],
  queryFn: () => fromSupabase(supabase.from('profiles').select('*')),
});

export const useAddProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newProfile) => fromSupabase(supabase.from('profiles').insert([newProfile])),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updates }) => 
      fromSupabase(supabase.from('profiles').update(updates).eq('id', id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
};

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => fromSupabase(supabase.from('profiles').delete().eq('id', id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
};