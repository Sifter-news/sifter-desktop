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
  isEditing,
  isFocused,
  dimensions,
  textSize = "medium",
  textAlign = "left",
  color = "bg-white",
  onEditStart,
  localTitle,
  localDescription,
  setLocalTitle,
  setLocalDescription,
  handleBlur
}) => {
  const baseClasses = cn(
    textSizeClasses[textSize],
    `text-${textAlign}`,
    color,
    "p-2 w-full h-full transition-all duration-200 rounded-lg shadow-sm border-[0.5px] border-gray-200/50 shadow-md"
  );

  // Render compact style (avatar only)
  if (style === 'compact') {
    return (
      <div className={cn(baseClasses, "flex items-center justify-center p-2")}>
        <NodeAvatar src={node.avatar} alt={node.title} size="large" nodeType={node.nodeType} />
      </div>
    );
  }

  // Render post-it style with conditional content
  if (style === 'postit') {
    const isEmpty = !node.description && !node.title;
    const isSimplified = isEmpty && !isFocused;

    if (isSimplified) {
      return (
        <div className={baseClasses}>
          <div className="flex items-center gap-2">
            <NodeAvatar src={node.avatar} alt={node.title} nodeType={node.nodeType} />
            <div className="text-sm text-gray-400 italic">Empty note</div>
          </div>
        </div>
      );
    }

    return (
      <div 
        className={baseClasses}
        onClick={(e) => {
          if (isFocused && e.target === e.currentTarget) {
            onEditStart?.();
          }
        }}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-start gap-3 mb-2">
            <NodeAvatar src={node.avatar} alt={node.title} nodeType={node.nodeType} />
            <div className="flex-1 min-w-0">
              {isEditing ? (
                <input
                  type="text"
                  value={localTitle}
                  onChange={(e) => setLocalTitle?.(e.target.value)}
                  onBlur={handleBlur}
                  className="w-full bg-transparent border-none focus:outline-none font-medium"
                  placeholder="Title"
                  autoFocus
                />
              ) : (
                <div className="font-medium truncate">{node.title || 'Untitled'}</div>
              )}
              {isEditing ? (
                <textarea
                  value={localDescription}
                  onChange={(e) => setLocalDescription?.(e.target.value)}
                  onBlur={handleBlur}
                  className="w-full bg-transparent border-none focus:outline-none text-sm text-gray-600 mt-1 resize-none"
                  placeholder="Description"
                  rows={3}
                />
              ) : (
                node.description && (
                  <div className="text-sm text-gray-600 mt-1">{node.description}</div>
                )
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