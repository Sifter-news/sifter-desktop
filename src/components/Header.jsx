import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserProfile from './UserProfile';

const Header = ({ user, projectName, onProjectClick }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4 min-w-[200px]">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="Sifter Logo" />
              <AvatarFallback>SL</AvatarFallback>
            </Avatar>
            <span className="text-sm font-normal">Sifter</span>
          </div>
        </div>
        <div className="flex-grow flex justify-center items-center">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="Dashboard Icon" />
              <AvatarFallback>DI</AvatarFallback>
            </Avatar>
            {projectName ? (
              <span className="text-sm font-normal text-[#4B25F3] cursor-pointer" onClick={onProjectClick}>{projectName}</span>
            ) : (
              <span className="text-sm font-normal text-[#4B25F3]">Dashboard Name</span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4 min-w-[200px] justify-end">
          <Link to="/" className="text-sm font-normal text-gray-400 hover:text-gray-600 transition-colors">
            Dashboard
          </Link>
          <UserProfile user={user} />
        </div>
      </div>
    </header>
  );
};

export default Header;