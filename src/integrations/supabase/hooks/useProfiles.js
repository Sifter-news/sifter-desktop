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
    
    // First check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    // If profile exists, return it
    if (existingProfile) {
      return existingProfile;
    }
    
    // If no profile exists, create one
    const { data: userData } = await supabase.auth.getUser();
    const newProfile = {
      id: id,
      username: userData.user?.email?.split('@')[0] || 'user',
      email: userData.user?.email,
      created_at: new Date().toISOString()
    };
    
    const { data: createdProfile, error: createError } = await supabase
      .from('profiles')
      .insert([newProfile])
      .select()
      .single();
    
    if (createError) throw createError;
    return createdProfile;
  },
  enabled: !!id,
  retry: 1
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
