import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserProfile from './UserProfile';
import { useDarkMode } from '../contexts/DarkModeContext';
import { Moon, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Header = ({ user, projectName, onProjectClick, onUpdateUser }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4 min-w-[200px]">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/default-image.png" alt="Sifter Logo" />
              <AvatarFallback>SL</AvatarFallback>
            </Avatar>
            <span className="text-sm font-normal dark:text-white">Sifter</span>
          </div>
        </div>
        <div className="flex-grow flex justify-center items-center">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/default-image.png" alt="Dashboard Icon" />
              <AvatarFallback>DI</AvatarFallback>
            </Avatar>
            {projectName ? (
              <span className="text-sm font-normal text-[#4B25F3] dark:text-[#7B5FF5] cursor-pointer" onClick={onProjectClick}>{projectName}</span>
            ) : (
              <span className="text-sm font-normal text-[#4B25F3] dark:text-[#7B5FF5]">Dashboard Name</span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4 min-w-[200px] justify-end">
          <Link to="/" className="text-sm font-normal text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors">
            Dashboard
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full"
          >
            {isDarkMode ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>
          <UserProfile user={user} onUpdateUser={onUpdateUser} />
        </div>
      </div>
    </header>
  );
};

export default Header;