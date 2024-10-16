import React from 'react';
import { Button } from "@/components/ui/button";
import ProfileDialog from './ProfileDialog';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserProfile = ({ user }) => {
  return (
    <div className="flex items-center space-x-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src="/default-image.png" alt={user.name} />
        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <Button variant="ghost" className="text-sm">{user.name}</Button>
      <ProfileDialog user={user} />
    </div>
  );
};

export default UserProfile;