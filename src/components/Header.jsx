import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import UserProfile from './UserProfile';
import { Separator } from "@/components/ui/separator";
import ProjectEditDialog from './shared/ProjectEditDialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Header = ({ user, project, onProjectUpdate }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
          {project?.title && (
            <div className="flex items-center space-x-4">
              <span 
                className="text-sm font-normal text-[#4B25F3] cursor-pointer hover:underline"
                onClick={() => setIsEditModalOpen(true)}
              >
                {project.title}
              </span>
              <Separator orientation="vertical" className="h-4" />
              <Select value={project.investigation_type} disabled>
                <SelectTrigger className="w-[240px] whitespace-normal border-none focus:ring-0">
                  <SelectValue placeholder="Select investigation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Due Diligence</SelectLabel>
                    <SelectItem value="pre-deal">Pre-Deal Due Diligence Investigation</SelectItem>
                    <SelectItem value="post-deal">Post-Deal Due Diligence Investigation</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Compliance</SelectLabel>
                    <SelectItem value="aml">Anti-Money Laundering Investigation</SelectItem>
                    <SelectItem value="kyc">Know Your Customer Investigation</SelectItem>
                    <SelectItem value="regulatory">Regulatory Compliance Investigation</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Corporate</SelectLabel>
                    <SelectItem value="fraud">Fraud Investigation</SelectItem>
                    <SelectItem value="background">Background Check Investigation</SelectItem>
                    <SelectItem value="asset">Asset Tracing Investigation</SelectItem>
                    <SelectItem value="generic">Generic Investigation</SelectItem>
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
          <UserProfile user={user} />
        </div>
      </div>

      <ProjectEditDialog 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={project}
        onUpdate={onProjectUpdate}
      />
    </header>
  );
};

export default Header;