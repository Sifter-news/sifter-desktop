import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard } from 'lucide-react';

const GlobalNav = () => {
  return (
    <nav className="flex space-x-4">
      <Link to="/" className="flex items-center">
        <LayoutDashboard className="h-5 w-5 md:hidden" />
        <span className="hidden md:inline">Dashboard</span>
      </Link>
      <Link to="/projects" className="flex items-center">
        <span className="hidden md:inline">Projects</span>
      </Link>
      <Link to="/settings" className="flex items-center">
        <span className="hidden md:inline">Settings</span>
      </Link>
      <Link to="/profile" className="flex items-center">
        <span className="hidden md:inline">Profile</span>
      </Link>
    </nav>
  );
};

export default GlobalNav;
