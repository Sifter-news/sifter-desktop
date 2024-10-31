import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';

/*
### node

| name             | type                    | format  | required |
|------------------|-------------------------|---------|----------|
| id               | uuid                    | uuid    | true     |
| title            | varchar                 | string  | false    |
| description      | text                    | string  | false    |
| type             | varchar(50)             | string  | false    |
| avatar           | text                    | string  | false    |
| is_public        | boolean                 | boolean | false    |
| owner_id         | uuid                    | uuid    | false    |
| investigation_id | uuid                    | uuid    | false    |
| parent_node_id   | uuid                    | uuid    | false    |
| position_x       | numeric                 | number  | false    |
| position_y       | numeric                 | number  | false    |
| position_z       | numeric                 | number  | false    |
| width           | numeric                 | number  | false    |
| height          | numeric                 | number  | false    |
| visual_style    | varchar(50)             | string  | false    |
| node_type       | varchar(50)             | string  | false    |
| created_at      | timestamp               | string  | false    |

Foreign Key Relationships:
- owner_id references profiles.id
- investigation_id references investigations.id
- parent_node_id references node.id (self-referential)
*/

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const useNode = (id) => useQuery({
  queryKey: ['nodes', id],
  queryFn: () => fromSupabase(
    supabase.from('node').select('*').eq('id', id).single()
  ),
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
    mutationFn: async (newNode) => {
      const { data, error } = await supabase
        .from('node')
        .insert([newNode])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['nodes'] });
      if (data.investigation_id) {
        queryClient.invalidateQueries({ 
          queryKey: ['nodes', { investigationId: data.investigation_id }] 
        });
      }
    }
  });
};

export const useUpdateNode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }) => {
      const { data, error } = await supabase
        .from('node')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['nodes'] });
      if (data.investigation_id) {
        queryClient.invalidateQueries({ 
          queryKey: ['nodes', { investigationId: data.investigation_id }] 
        });
      }
    }
  });
};

export const useDeleteNode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from('node')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nodes'] });
    }
  });
};