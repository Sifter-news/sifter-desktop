import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from 'lucide-react';

const NodeEditForm = ({ formData, setFormData, handleImageUpload }) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="flex items-center justify-center">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={formData.avatar} alt="Avatar" />
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
            onChange={handleImageUpload}
          />
        </div>
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        />
      </div>
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
      </div>
    </div>
  );
};

export default NodeEditForm;