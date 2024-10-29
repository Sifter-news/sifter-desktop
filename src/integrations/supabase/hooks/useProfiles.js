import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../supabase';

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const useProfile = (id) => useQuery({
  queryKey: ['profiles', id],
  queryFn: async () => {
    if (!id) return null;
    
    try {
      const { data: existingProfile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (existingProfile) {
        return existingProfile;
      }
      
      // If no profile exists, create one
      const { data: { user } } = await supabase.auth.getUser();
      const newProfile = {
        id: id,
        username: user?.email?.split('@')[0] || 'user',
        email: user?.email,
        created_at: new Date().toISOString()
      };
      
      const { data: createdProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();
      
      if (insertError) throw insertError;
      
      return createdProfile || newProfile;
    } catch (error) {
      console.error('Profile fetch/create error:', error);
      throw error;
    }
  },
  enabled: !!id,
  retry: false
});

export const useProfiles = () => useQuery({
  queryKey: ['profiles'],
  queryFn: () => fromSupabase(supabase.from('profiles').select('*')),
});

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
    },
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
    },
  });
};