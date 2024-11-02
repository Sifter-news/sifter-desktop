import React from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserIcon, ImageIcon } from 'lucide-react';

const ProfileTabContent = ({ 
  avatar, 
  username, 
  name, 
  email, 
  onImageUpload, 
  onUsernameChange, 
  onNameChange, 
  onSave 
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your profile details and photo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center mb-6">
          <div className="relative group">
            <Avatar className="h-24 w-24">
              <AvatarImage src={avatar} alt={username} />
              <AvatarFallback><UserIcon className="h-12 w-12" /></AvatarFallback>
            </Avatar>
            <Label htmlFor="avatar-upload" className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-full cursor-pointer transition-opacity">
              <ImageIcon className="h-6 w-6" />
            </Label>
            <Input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onImageUpload}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                value={username}
                onChange={onUsernameChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={name}
                onChange={onNameChange}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              value={email} 
              disabled 
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileTabContent;