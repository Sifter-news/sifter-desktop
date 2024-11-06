import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

/*
### reports

| name            | type                | format  | required |
|-----------------|---------------------|---------|----------|
| id              | uuid                | string  | true     |
| investigation_id| uuid (FK:investigations)| string | false |
| title           | varchar(255)        | string  | true     |
| content         | text                | string  | false    |
| created_at      | timestamp           | string  | false    |
| updated_at      | timestamp           | string  | false    |

Foreign Key Relationships:
- investigation_id references investigations.id
*/

export const useReport = (id) => useQuery({
  queryKey: ['reports', id],
  queryFn: () => fromSupabase(supabase.from('reports').select('*').eq('id', id).single()),
  enabled: !!id
});

export const useReports = (investigationId) => useQuery({
  queryKey: ['reports', { investigationId }],
  queryFn: () => fromSupabase(
    supabase.from('reports')
      .select('*')
      .eq('investigation_id', investigationId)
  ),
  enabled: !!investigationId
});

export const useAddReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newReport) => fromSupabase(
      supabase.from('reports').insert([newReport])
    ),
    onSuccess: (_, { investigation_id }) => {
      queryClient.invalidateQueries({ queryKey: ['reports', { investigationId: investigation_id }] });
    }
  });
};

export const useUpdateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updates }) => fromSupabase(
      supabase.from('reports').update(updates).eq('id', id)
    ),
    onSuccess: (_, { id, investigation_id }) => {
      queryClient.invalidateQueries({ queryKey: ['reports', { investigationId: investigation_id }] });
      queryClient.invalidateQueries({ queryKey: ['reports', id] });
    }
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => fromSupabase(
      supabase.from('reports').delete().eq('id', id)
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    }
  });
};