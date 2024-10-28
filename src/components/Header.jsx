import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import UserProfile from './UserProfile';
import { Separator } from "@/components/ui/separator";
import InvestigationModal from './modals/InvestigationModal';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Header = ({ user, projectName, onProjectClick, onUpdateUser, onProjectUpdate, onProjectDelete }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [investigatorType, setInvestigatorType] = useState('generic');

  useEffect(() => {
    const fetchInvestigationType = async () => {
      if (!projectName) return;
      
      try {
        const { data, error } = await supabase
          .from('investigations')
          .select('investigation_type')
          .eq('title', projectName)
          .limit(1)
          .single();
          
        if (error) throw error;
        
        if (data?.investigation_type) {
          setInvestigatorType(data.investigation_type);
        }
      } catch (error) {
        console.error('Error fetching investigation type:', error);
      }
    };

    fetchInvestigationType();
  }, [projectName]);

  const handleTypeChange = async (value) => {
    setInvestigatorType(value);
    
    try {
      const { error } = await supabase
        .from('investigations')
        .update({ investigation_type: value })
        .eq('title', projectName);
        
      if (error) throw error;
      
      toast.success('Investigation type updated successfully');
    } catch (error) {
      console.error('Error updating investigation type:', error);
      toast.error('Failed to update investigation type');
    }
  };

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
          {projectName && (
            <div className="flex items-center space-x-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/default-image.png" alt="Project Avatar" />
                <AvatarFallback>P</AvatarFallback>
              </Avatar>
              <span 
                className="text-sm font-normal text-[#4B25F3] cursor-pointer hover:underline"
                onClick={() => setIsEditModalOpen(true)}
              >
                {projectName}
              </span>
            </div>
          )}
        </div>

        <div className="min-w-[200px] flex justify-end items-center space-x-2">
          <Link to="/" className="text-sm font-normal text-gray-400 hover:text-gray-600 transition-colors">
            Dashboard
          </Link>
          
          {projectName && (
            <>
              <Select value={investigatorType} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-fit border-none focus:ring-0 [&>span]:line-clamp-1 px-2">
                  <SelectValue placeholder="Select investigation type" />
                </SelectTrigger>
                <SelectContent className="w-fit min-w-[200px]">
                  <SelectGroup>
                    <SelectLabel>Generic</SelectLabel>
                    <SelectItem value="generic">Generic</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                  </SelectGroup>
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
                    <SelectItem value="fraud">Fraud</SelectItem>
                    <SelectItem value="background">Background Check</SelectItem>
                    <SelectItem value="asset">Asset Tracing</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Separator orientation="vertical" className="h-4 mx-2" />
            </>
          )}
          
          <UserProfile user={user} onUpdateUser={onUpdateUser} />
        </div>
      </div>

      <InvestigationModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        investigation={projectName}
        onUpdate={onProjectUpdate}
      />
    </header>
  );
};

export default Header;