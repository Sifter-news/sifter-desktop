import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

/*
### investigations

| name               | type                | format | required |
|-------------------|---------------------|---------|----------|
| id                | uuid                | string  | true     |
| title             | varchar(255)        | string  | true     |
| description       | text                | string  | false    |
| owner_id          | uuid (FK:profiles)  | string  | false    |
| created_at        | timestamp           | string  | false    |
| visibility        | varchar(20)         | string  | false    |
| view_type         | varchar(20)         | string  | false    |
| investigation_type| varchar(50)         | string  | false    |

Foreign Key Relationships:
- owner_id references profiles.id
*/

export const useInvestigation = (id) => useQuery({
  queryKey: ['investigations', id],
  queryFn: () => fromSupabase(supabase.from('investigations').select('*').eq('id', id).single()),
  enabled: !!id
});

export const useInvestigations = () => useQuery({
  queryKey: ['investigations'],
  queryFn: () => fromSupabase(supabase.from('investigations').select('*'))
});

export const useAddInvestigation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newInvestigation) => fromSupabase(
      supabase.from('investigations').insert([newInvestigation])
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investigations'] });
    }
  });
};

export const useUpdateInvestigation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updates }) => fromSupabase(
      supabase.from('investigations').update(updates).eq('id', id)
    ),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['investigations'] });
      queryClient.invalidateQueries({ queryKey: ['investigations', id] });
    }
  });
};

export const useDeleteInvestigation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => fromSupabase(
      supabase.from('investigations').delete().eq('id', id)
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['investigations'] });
    }
  });
};