import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Upload } from 'lucide-react';

const NodeAvatarSection = ({ avatar, onImageUpload }) => {
  return (
    <div className="relative -mx-6 -mt-4">
      <div 
        className="h-32 bg-cover bg-center w-full"
        style={{ 
          backgroundImage: `url(${avatar || '/default-image.png'})`,
          backgroundColor: '#f3f4f6' 
        }}
      >
        <div className="absolute bottom-2 right-2">
          <Label
            htmlFor="avatar-upload"
            className="p-2 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 flex items-center justify-center"
          >
            <Upload className="h-4 w-4" />
          </Label>
          <Input
            id="avatar-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onImageUpload(file);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default NodeAvatarSection;