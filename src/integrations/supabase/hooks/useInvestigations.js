import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

/*
### investigations

| name        | type      | format    | required |
|-------------|-----------|-----------|----------|
| id          | uuid      | string    | true     |
| title       | varchar   | string    | true     |
| description | text      | string    | false    |
| owner_id    | uuid      | string    | false    |
| created_at  | timestamp | string    | false    |
| visibility  | varchar   | string    | false    |
| view_type   | varchar   | string    | false    |

Foreign Key Relationships:
- owner_id references profiles.id
*/

export const useInvestigation = (id) => useQuery({
  queryKey: ['investigations', id],
  queryFn: () => fromSupabase(supabase.from('investigations').select('*').eq('id', id).single()),
});

export const useInvestigations = () => useQuery({
  queryKey: ['investigations'],
  queryFn: () => fromSupabase(supabase.from('investigations').select('*')),
});

export const useAddInvestigation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newInvestigation) => 
      fromSupabase(supabase.from('investigations').insert([newInvestigation])),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investigations'] });
    },
  });
};

export const useUpdateInvestigation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updates }) => 
      fromSupabase(supabase.from('investigations').update(updates).eq('id', id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investigations'] });
    },
  });
};

export const useDeleteInvestigation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => fromSupabase(supabase.from('investigations').delete().eq('id', id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investigations'] });
    },
  });
};