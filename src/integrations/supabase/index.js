// Import all hooks
import {
  useInvestigation,
  useInvestigations,
  useAddInvestigation,
  useUpdateInvestigation,
  useDeleteInvestigation
} from './hooks/useInvestigations';

import {
  useNode,
  useNodes,
  useAddNode,
  useUpdateNode,
  useDeleteNode
} from './hooks/useNodes';

import {
  useProfile,
  useUpdateProfile
} from './hooks/useProfiles';

import {
  useReport,
  useReports,
  useAddReport,
  useUpdateReport,
  useDeleteReport
} from './hooks/useReports';

import { supabase } from './supabase';
import { SupabaseAuthProvider, useSupabaseAuth } from './auth';

// Export all hooks and utilities
export {
  // Auth
  SupabaseAuthProvider,
  useSupabaseAuth,
  
  // Investigations
  useInvestigation,
  useInvestigations,
  useAddInvestigation,
  useUpdateInvestigation,
  useDeleteInvestigation,
  
  // Nodes
  useNode,
  useNodes,
  useAddNode,
  useUpdateNode,
  useDeleteNode,
  
  // Profiles
  useProfile,
  useUpdateProfile,
  
  // Reports
  useReport,
  useReports,
  useAddReport,
  useUpdateReport,
  useDeleteReport,
  
  // Supabase instance
  supabase
};