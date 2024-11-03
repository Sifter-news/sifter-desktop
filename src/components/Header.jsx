import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserProfile from './UserProfile';
import { Separator } from "@/components/ui/separator";
import ModalEdit_Investigation from './modals/ModalEdit_Investigation';
import { supabase } from '@/config/supabase';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, LayoutDashboard } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Header = ({ user, projectName, onProjectClick, onUpdateUser, onProjectUpdate, onProjectDelete }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('username, full_name')
          .eq('id', user.id)
          .single();
          
        if (error) throw error;
        
        setUsername(data?.full_name || data?.username || user.email?.split('@')[0] || '');
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, [user]);

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-[9999]">
      <div className="mx-auto px-12 py-2 flex items-center">
        <div className="w-[200px] flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <img 
              src="https://lov-p-3964558a-5b48-4155-a181-8d109765ccfa.fly.dev/favicon.ico" 
              alt="Sifter Logo" 
              className="h-8 w-8" 
            />
            <span className="text-sm font-normal">Sifter</span>
            <span className="text-sm font-normal text-gray-400">Beta</span>
          </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-4">
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

        <div className="ml-auto w-[200px] flex justify-end items-center space-x-2">
          {projectName && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                    <span className="hidden md:inline">Dashboard</span>
                    <LayoutDashboard className="h-5 w-5 md:hidden" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Dashboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <span className="hidden md:inline font-medium">{username}</span>
                    <User className="h-5 w-5 md:hidden" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{username}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <UserProfile user={user} onUpdateUser={onUpdateUser} />
          </div>
        </div>
      </div>

      <ModalEdit_Investigation 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        investigation={projectName}
        onUpdate={onProjectUpdate}
      />
    </header>
  );
};

export default Header;