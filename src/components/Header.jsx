import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import UserProfile from './UserProfile';
import ProjectEditModal from './ProjectEditModal';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Header = ({ user, projectName, onProjectClick, onUpdateUser, onProjectUpdate, onProjectDelete }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [investigatorType, setInvestigatorType] = useState('private');

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto px-12 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4 min-w-[200px]">
          <div className="flex items-center space-x-2">
            <img src="/favicon.ico" alt="Sifter Logo" className="h-8 w-8" />
            <span className="text-sm font-normal">Sifter</span>
            <span className="text-sm font-normal text-gray-400">beta</span>
          </div>
        </div>
        <div className="flex-grow flex justify-center items-center">
          {projectName && (
            <span 
              className="text-sm font-normal text-[#4B25F3] cursor-pointer hover:underline" 
              onClick={() => setIsEditModalOpen(true)}
            >
              {projectName}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-4 min-w-[200px] justify-end">
          <Link to="/" className="text-sm font-normal text-gray-400 hover:text-gray-600 transition-colors">
            Dashboard
          </Link>
          <Select value={investigatorType} onValueChange={setInvestigatorType}>
            <SelectTrigger className="w-[180px] bg-white whitespace-nowrap">
              <SelectValue placeholder="Select investigator type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">Private Investigator</SelectItem>
              <SelectItem value="police">Police Detective</SelectItem>
              <SelectItem value="journalist">Investigative Journalist</SelectItem>
              <SelectItem value="corporate">Corporate Investigator</SelectItem>
              <SelectItem value="cyber">Cyber Investigator</SelectItem>
            </SelectContent>
          </Select>
          <UserProfile user={user} onUpdateUser={onUpdateUser} />
        </div>
      </div>
      <ProjectEditModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        projectName={projectName}
        onUpdate={onProjectUpdate}
        onDelete={onProjectDelete}
      />
    </header>
  );
};

export default Header;