/**
 * @file Header.jsx
 * @description Main navigation header component for global app access and user settings
 */

import React from 'react';
import { useAuth } from '@/components/auth';

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="w-full h-16 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold">Investigation Tool</h1>
        </div>
        
        {user && (
          <div className="flex items-center gap-4">
            <button onClick={signOut} className="text-sm text-gray-600 hover:text-gray-900">
              Sign Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;