import React from 'react';
import { cn } from "@/lib/utils";

const textSizeClasses = {
  small: "text-sm",
  medium: "text-base",
  large: "text-lg",
  huge: "text-xl"
};

const NodeContent = ({ 
  style, 
  node, 
  isFocused,
  dimensions,
  textSize = "medium",
  textAlign = "left"
}) => {
  const baseClasses = cn(
    textSizeClasses[textSize],
    `text-${textAlign}`,
    "p-4 w-full h-full transition-all duration-200"
  );

  return (
    <div className={baseClasses}>
      <div className="font-medium mb-2">{node.title}</div>
      {node.description && (
        <div className="text-gray-600 text-sm">{node.description}</div>
      )}
    </div>
  );
};

export default NodeContent;