import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';

const DEFAULT_AVATAR = '/default-image.png';

const fromSupabase = async (query) => {
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const useProfile = (id) => useQuery({
  queryKey: ['profiles', id],
  queryFn: () => fromSupabase(
    supabase.from('profiles').select('*').eq('id', id).single()
  ).then(data => ({
    ...data,
    avatar_url: data?.avatar_url || DEFAULT_AVATAR
  })),
  enabled: !!id
});

export const useProfiles = () => useQuery({
  queryKey: ['profiles'],
  queryFn: () => fromSupabase(
    supabase.from('profiles').select('*')
  ).then(data => data.map(profile => ({
    ...profile,
    avatar_url: profile?.avatar_url || DEFAULT_AVATAR
  })))
});

export const useAddProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newProfile) => {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          ...newProfile,
          avatar_url: newProfile.avatar_url || DEFAULT_AVATAR
        }])
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