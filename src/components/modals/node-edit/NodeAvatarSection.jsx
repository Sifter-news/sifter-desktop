import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload } from 'lucide-react';

const NodeAvatarSection = ({ avatar, onImageUpload }) => {
  return (
    <div className="flex items-center justify-center mb-4">
      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage src={avatar} alt="Avatar" />
          <AvatarFallback>Avatar</AvatarFallback>
        </Avatar>
        <Label
          htmlFor="avatar-upload"
          className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90"
        >
          <Upload className="h-4 w-4" />
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
  );
};

export default NodeAvatarSection;