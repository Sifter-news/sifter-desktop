import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { FileText } from 'lucide-react';

const NodeAvatar = ({ src, alt, size = "default" }) => {
  const sizeClasses = {
    small: "h-6 w-6",
    default: "h-8 w-8",
    large: "h-10 w-10"
  };

  return (
    <Avatar className={sizeClasses[size]}>
      <AvatarImage src={src || "/default-image.png"} alt={alt} />
      <AvatarFallback><FileText className="h-4 w-4" /></AvatarFallback>
    </Avatar>
  );
};

export default NodeAvatar;