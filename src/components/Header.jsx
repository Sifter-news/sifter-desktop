import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import UserProfile from './UserProfile';
import ProjectEditModal from './ProjectEditModal';
import { useState } from 'react';

const Header = ({ user, projectName, onProjectClick, onUpdateUser, onProjectUpdate, onProjectDelete }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
          <div className="flex items-center space-x-2">
            <img src="/placeholder.svg" alt="Dashboard Icon" className="h-8 w-8" />
            {projectName ? (
              <span 
                className="text-sm font-normal text-[#4B25F3] cursor-pointer hover:underline" 
                onClick={() => setIsEditModalOpen(true)}
              >
                {projectName}
              </span>
            ) : (
              <span className="text-sm font-normal text-[#4B25F3]">Loading...</span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4 min-w-[200px] justify-end">
          <Link to="/" className="text-sm font-normal text-gray-400 hover:text-gray-600 transition-colors">
            Dashboard
          </Link>
          <span className="text-sm font-normal">{user.name}</span>
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