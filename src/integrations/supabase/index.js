import { supabase } from './supabase.js';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth.jsx';
import { useProfile, useUpdateProfile, useProfiles, useAddProfile, useDeleteProfile } from './hooks/useProfiles';
import { useNode, useNodes, useAddNode, useUpdateNode, useDeleteNode } from './hooks/useNodes';

export {
  supabase,
  SupabaseAuthProvider,
  useSupabaseAuth,
  SupabaseAuthUI,
  // Profile hooks
  useProfile,
  useProfiles,
  useAddProfile,
  useUpdateProfile,
  useDeleteProfile,
  // Node hooks
  useNode,
  useNodes,
  useAddNode,
  useUpdateNode,
  useDeleteNode
};