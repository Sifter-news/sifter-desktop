import { supabase } from './supabase';
import { SupabaseAuthProvider, useSupabaseAuth, SupabaseAuthUI } from './auth';

// Import hooks
import { 
  useProfile, 
  useProfiles, 
  useAddProfile, 
  useUpdateProfile, 
  useDeleteProfile 
} from './hooks/useProfiles';

import {
  useInvestigation,
  useInvestigations,
  useAddInvestigation,
  useUpdateInvestigation,
  useDeleteInvestigation
} from './hooks/useInvestigations';

import {
  useReport,
  useReports,
  useAddReport,
  useUpdateReport,
  useDeleteReport
} from './hooks/useReports';

// Export all
export {
  // Supabase core
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
  
  // Investigation hooks
  useInvestigation,
  useInvestigations,
  useAddInvestigation,
  useUpdateInvestigation,
  useDeleteInvestigation,
  
  // Report hooks
  useReport,
  useReports,
  useAddReport,
  useUpdateReport,
  useDeleteReport
};