import React from 'react';
import { Link } from 'react-router-dom';
import UserProfile from './UserProfile';

const Header = ({ user, projectName, onProjectClick, onUpdateUser }) => {
  const proxyUrl = 'https://your-project-id.supabase.co/functions/v1/image-proxy?url=';
  const logoUrl = encodeURIComponent('https://files.slack.com/files-pri/T0H44FCFR-F07SQ8UB8JD/logo_sifter_256px.png');

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto px-12 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-4 min-w-[200px]">
          <div className="flex items-center space-x-2">
            <img src={`${proxyUrl}${logoUrl}`} alt="Sifter Logo" className="h-8 w-8" />
            <span className="text-sm font-normal">Sifter</span>
            <span className="text-sm font-normal text-gray-400">beta</span>
          </div>
        </div>
        <div className="flex-grow flex justify-center items-center">
          <div className="flex items-center space-x-2">
            <img src="/placeholder.svg" alt="Dashboard Icon" className="h-8 w-8" />
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
          <UserProfile user={user} onUpdateUser={onUpdateUser} />
        </div>
      </div>
    </header>
  );
};

export default Header;