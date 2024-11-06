import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data;
};

/*
### node

| name             | type                | format  | required |
|-----------------|---------------------|---------|----------|
| id              | uuid                | string  | true     |
| title           | varchar(255)        | string  | false    |
| description     | text                | string  | false    |
| type            | varchar(50)         | string  | false    |
| avatar          | text                | string  | false    |
| is_public       | boolean             | boolean | false    |
| owner_id        | uuid (FK:profiles)  | string  | false    |
| investigation_id| uuid (FK:investigations)| string | false |
| parent_node_id  | uuid (FK:node)      | string  | false    |
| created_at      | timestamp           | string  | false    |
| position_x      | numeric             | number  | false    |
| position_y      | numeric             | number  | false    |
| width           | numeric             | number  | false    |
| height          | numeric             | number  | false    |
| visual_style    | varchar(50)         | string  | false    |
| node_type       | varchar(50)         | string  | false    |
| position_z      | numeric             | number  | false    |

Foreign Key Relationships:
- owner_id references profiles.id
- investigation_id references investigations.id
- parent_node_id references node.id (self-referential)
*/

export const useNode = (id) => useQuery({
  queryKey: ['nodes', id],
  queryFn: () => fromSupabase(supabase.from('node').select('*').eq('id', id).single()),
  enabled: !!id
});

export const useNodes = (investigationId) => useQuery({
  queryKey: ['nodes', { investigationId }],
  queryFn: () => fromSupabase(
    supabase.from('node')
      .select('*')
      .eq('investigation_id', investigationId)
  ),
  enabled: !!investigationId
});

export const useAddNode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newNode) => fromSupabase(
      supabase.from('node').insert([newNode])
    ),
    onSuccess: (_, { investigation_id }) => {
      queryClient.invalidateQueries({ queryKey: ['nodes', { investigationId: investigation_id }] });
    }
  });
};

export const useUpdateNode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...updates }) => fromSupabase(
      supabase.from('node').update(updates).eq('id', id)
    ),
    onSuccess: (_, { id, investigation_id }) => {
      queryClient.invalidateQueries({ queryKey: ['nodes', { investigationId: investigation_id }] });
      queryClient.invalidateQueries({ queryKey: ['nodes', id] });
    }
  });
};

export const useDeleteNode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => fromSupabase(
      supabase.from('node').delete().eq('id', id)
    ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nodes'] });
    }
  });
};