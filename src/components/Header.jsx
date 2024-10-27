import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import UserProfile from './UserProfile';
import ProjectEditModal from './ProjectEditModal';
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
import { User } from 'lucide-react';

const Header = ({ user, projectName, onProjectClick, onUpdateUser, onProjectUpdate, onProjectDelete }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [investigatorType, setInvestigatorType] = useState('pre-deal');

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
              <span 
                className="text-sm font-normal text-[#4B25F3] cursor-pointer hover:underline" 
                onClick={() => setIsEditModalOpen(true)}
              >
                {projectName}
              </span>
              <Separator orientation="vertical" className="h-4" />
              <Select value={investigatorType} onValueChange={setInvestigatorType}>
                <SelectTrigger className="w-[180px] bg-white whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <SelectValue placeholder="Select investigation type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
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
          <UserProfile user={user} onUpdateUser={onUpdateUser} />
          <Separator orientation="vertical" className="h-4 mx-2" />
          <Link to="/" className="text-sm font-normal text-gray-400 hover:text-gray-600 transition-colors">
            Dashboard
          </Link>
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