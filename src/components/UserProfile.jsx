import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserIcon } from 'lucide-react';

const UserProfile = ({ user }) => {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" className="text-sm">{user.name}</Button>
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback><UserIcon className="h-4 w-4" /></AvatarFallback>
      </Avatar>
    </div>
  );
};

export default UserProfile;