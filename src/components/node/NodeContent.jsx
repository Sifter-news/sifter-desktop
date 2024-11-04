import React from 'react';
import { cn } from "@/lib/utils";
import NodeAvatar from './NodeAvatar';

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
  textAlign = "left",
  color = "bg-white"
}) => {
  const baseClasses = cn(
    textSizeClasses[textSize],
    `text-${textAlign}`,
    color,
    "p-2 w-full h-full transition-all duration-200 rounded-lg shadow-sm"
  );

  // Render compact style (avatar only)
  if (style === 'compact') {
    return (
      <div className={cn(baseClasses, "flex items-center justify-center p-2")}>
        <NodeAvatar src={node.avatar} alt={node.title} size="large" nodeType={node.nodeType} />
      </div>
    );
  }

  // Render post-it style (aligned to top)
  if (style === 'postit') {
    return (
      <div className={baseClasses}>
        <div className="flex flex-col h-full">
          <div className="flex items-start gap-3 mb-2">
            <NodeAvatar src={node.avatar} alt={node.title} nodeType={node.nodeType} />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{node.title}</div>
              {node.description && (
                <div className="text-sm text-gray-600 mt-1">{node.description}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render default style (avatar + title only)
  return (
    <div className={baseClasses}>
      <div className="flex items-center h-full gap-3">
        <NodeAvatar src={node.avatar} alt={node.title} nodeType={node.nodeType} />
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{node.title}</div>
        </div>
      </div>
    </div>
  );
};

export default NodeContent;