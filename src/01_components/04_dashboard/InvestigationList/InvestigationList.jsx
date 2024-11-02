/**
 * @file InvestigationList.jsx
 * @description Lists all investigations available to the user
 * 
 * Potential improvements:
 * - Add sorting options (date, name, status)
 * - Add filtering by tags
 * - Add search functionality
 * - Add bulk actions
 * - Add list/grid view toggle
 * - Add investigation templates
 * - Add collaboration indicators
 */

import React from 'react';
import InvestigationCard from './InvestigationCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import { toast } from 'sonner';

const InvestigationList = ({ userId }) => {
  const { data: investigations, isLoading, isError } = useQuery(['investigations', userId], async () => {
    if (!userId) return [];
    const { data, error } = await supabase
      .from('investigations')
      .select('*')
      .eq('user_id', userId);
    
    if (error) {
      toast.error('Failed to load investigations');
      throw error;
    }
    return data;
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading investigations</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {investigations.map(investigation => (
        <InvestigationCard 
          key={investigation.id} 
          investigation={investigation} 
          onUpdate={() => {/* Define update logic */}} 
        />
      ))}
    </div>
  );
};

export default InvestigationList;
