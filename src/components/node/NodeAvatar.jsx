import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getNodeTypeIcon } from '@/utils/nodeConstants';

const NodeAvatar = ({ src, alt, size = "default", onImageUpload, nodeType }) => {
  const sizeClasses = {
    small: "h-6 w-6",
    default: "h-8 w-8",
    large: "h-10 w-10"
  };

  const Icon = getNodeTypeIcon(nodeType);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file && onImageUpload) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative group">
      <Avatar className={sizeClasses[size]}>
        <AvatarImage src={src || "/default-image.png"} alt={alt} />
        <AvatarFallback><Icon className="h-4 w-4" /></AvatarFallback>
      </Avatar>
      {onImageUpload && (
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      )}
    </div>
  );
};

export default NodeAvatar;