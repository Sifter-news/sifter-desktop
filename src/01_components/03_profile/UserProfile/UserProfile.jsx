/**
 * @file UserProfile.jsx
 * @description Main profile component displaying user information and profile picture
 * 
 * Potential improvements:
 * - Add profile completion percentage
 * - Add activity history
 * - Add connected accounts
 * - Add privacy settings
 * - Add data export functionality
 * - Add account deletion confirmation flow
 * - Add email verification status
 */

import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/components/auth';

const UserProfile = ({ user }) => {
  const { updateUserProfile } = useAuth();

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = {
      username: formData.get('username'),
      name: formData.get('name'),
      email: formData.get('email'),
      avatar: formData.get('avatar')
    };
    updateUserProfile(updatedData);
  };

  return (
    <div className="flex flex-col items-center">
      <form onSubmit={handleProfileUpdate} className="w-full max-w-md">
        <div className="mb-4">
          <Avatar className="h-32 w-32">
            <AvatarImage src={user.avatar || '/default-image.png'} alt={user.username} />
            <AvatarFallback>User</AvatarFallback>
          </Avatar>
        </div>

        <div className="mb-4">
          <Label htmlFor="username">Username</Label>
          <Input 
            id="username"
            name="username"
            defaultValue={user.username || ''}
            required
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="name">Name</Label>
          <Input 
            id="name"
            name="name"
            defaultValue={user.name || ''}
            required
          />
        </div>

        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email"
            name="email"
            type="email"
            defaultValue={user.email || ''}
            required
            disabled
          />
        </div>

        <Button type="submit" className="w-full">
          Update Profile
        </Button>
      </form>
    </div>
  );
};

export default UserProfile;
