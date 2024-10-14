import React from 'react';
import { Button } from "@/components/ui/button";
import ProfileDialog from './ProfileDialog';

const UserProfile = ({ user }) => {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" className="text-sm">{user.name}</Button>
      <ProfileDialog user={user} />
    </div>
  );
};

export default UserProfile;