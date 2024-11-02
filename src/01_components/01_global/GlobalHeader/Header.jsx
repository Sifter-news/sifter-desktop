/**
 * @file Header.jsx
 * @description Main navigation header component for global app access and user settings
 * 
 * Potential improvements:
 * - Add breadcrumb navigation for better wayfinding
 * - Implement responsive mobile menu
 * - Add search functionality
 * - Add notification system
 * - Add theme switcher
 * - Add language selector
 * - Add keyboard shortcuts modal
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import UserProfile from '../../03_profile/UserProfile/UserProfile';
import { useAuth } from '@/components/auth';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="container mx-auto h-full flex items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold">
          Investigation Platform
        </Link>

        <div className="flex items-center space-x-4">
          {user ? (
            <UserProfile user={user} />
          ) : (
            <Button asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;