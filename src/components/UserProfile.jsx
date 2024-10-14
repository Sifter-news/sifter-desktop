import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserIcon } from 'lucide-react';

const UserProfile = ({ user }) => {
  return (
    <div className="flex items-center space-x-4">
      <Avatar>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback><UserIcon /></AvatarFallback>
      </Avatar>
      <Button variant="ghost">{user.name}</Button>
    </div>
  );
};

export default UserProfile;