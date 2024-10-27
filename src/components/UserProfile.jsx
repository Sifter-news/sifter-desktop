import React from 'react';
import { Button } from "@/components/ui/button";
import ProfileDialog from './ProfileDialog';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { Moon, Sun } from 'lucide-react';

const UserProfile = ({ user }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleDarkMode}
        className="mr-2"
      >
        {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>
      <ProfileDialog user={user} />
    </div>
  );
};

export default UserProfile;