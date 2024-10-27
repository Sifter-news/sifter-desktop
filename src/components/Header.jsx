import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import UserProfile from './UserProfile';
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/supabase';
import { Skeleton } from "@/components/ui/skeleton";

const Header = ({ user, projectId, onUpdateUser }) => {
  const [investigatorType, setInvestigatorType] = React.useState('pre-deal');

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      if (!projectId) return null;
      const { data, error } = await supabase
        .from('investigations')
        .select('title, description')
        .eq('id', projectId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!projectId
  });

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto px-12 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4 min-w-[200px]">
          <div className="flex items-center space-x-2">
            <img src="/favicon.ico" alt="Sifter Logo" className="h-8 w-8" />
            <span className="text-sm font-normal">Sifter</span>
            <span className="text-sm font-normal text-gray-400">Beta</span>
          </div>
        </div>

        <div className="flex-grow flex justify-center items-center space-x-4">
          {projectId && (
            <div className="flex items-center space-x-4">
              {isLoading ? (
                <Skeleton className="h-6 w-[200px]" />
              ) : (
                <div className="flex flex-col items-center">
                  <span className="text-sm font-normal text-[#4B25F3]">
                    {project?.title}
                  </span>
                  {project?.description && (
                    <span className="text-xs text-gray-500">
                      {project.description}
                    </span>
                  )}
                </div>
              )}
              <Separator orientation="vertical" className="h-4" />
              <Select value={investigatorType} onValueChange={setInvestigatorType}>
                <SelectTrigger className="w-[240px] whitespace-normal border-none focus:ring-0">
                  <SelectValue placeholder="Select investigation type" />
                </SelectTrigger>
                <SelectContent className="w-[240px]">
                  <SelectGroup>
                    <SelectLabel>Due Diligence</SelectLabel>
                    <SelectItem value="pre-deal">Pre-Deal Due Diligence</SelectItem>
                    <SelectItem value="post-deal">Post-Deal Due Diligence</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Compliance</SelectLabel>
                    <SelectItem value="aml">Anti-Money Laundering</SelectItem>
                    <SelectItem value="kyc">Know Your Customer</SelectItem>
                    <SelectItem value="regulatory">Regulatory Compliance</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Corporate</SelectLabel>
                    <SelectItem value="fraud">Fraud Investigation</SelectItem>
                    <SelectItem value="background">Background Check</SelectItem>
                    <SelectItem value="asset">Asset Tracing</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        <div className="min-w-[200px] flex justify-end items-center space-x-2">
          <Link to="/" className="text-sm font-normal text-gray-400 hover:text-gray-600 transition-colors pr-4">
            Dashboard
          </Link>
          <Separator orientation="vertical" className="h-4 mx-2" />
          <UserProfile user={user} onUpdateUser={onUpdateUser} />
        </div>
      </div>
    </header>
  );
};

export default Header;