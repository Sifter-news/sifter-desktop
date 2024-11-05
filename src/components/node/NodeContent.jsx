import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import NodeAvatar from './NodeAvatar';
import { Textarea } from "@/components/ui/textarea";

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
  const [showEditText, setShowEditText] = useState(false);
  const [isDescriptionEditing, setIsDescriptionEditing] = useState(false);

  const handleNodeClick = () => {
    if (!node.description && !showEditText) {
      setShowEditText(true);
    } else if (showEditText && !isDescriptionEditing) {
      setIsDescriptionEditing(true);
    }
  };

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
    const isEmpty = !node.description && !showEditText;
    const isSimplified = isEmpty && !isFocused;

    if (isSimplified) {
      return (
        <div 
          className={baseClasses}
          onClick={handleNodeClick}
        >
          <div className="flex flex-col items-center gap-2">
            <NodeAvatar src={node.avatar} alt={node.title} nodeType={node.nodeType} />
            <div className="text-sm text-gray-400 italic cursor-text">
              Click to add description
            </div>
          </div>
        </div>
      );
    }

    return (
      <div 
        className={baseClasses}
        onClick={handleNodeClick}
      >
        <div className="flex flex-col h-full items-center">
          <NodeAvatar src={node.avatar} alt={node.title} nodeType={node.nodeType} className="mb-2" />
          <div className="w-full text-center mb-3">
            {isEditing ? (
              <input
                type="text"
                value={localTitle}
                onChange={(e) => setLocalTitle?.(e.target.value)}
                onBlur={handleBlur}
                className="w-full bg-transparent focus:outline-none focus:ring-white font-medium text-center"
                placeholder="Title"
                autoFocus
              />
            ) : (
              <div className="font-medium">{node.title || 'Untitled'}</div>
            )}
          </div>
          <div className="w-full flex-1 min-h-0">
            {isDescriptionEditing ? (
              <Textarea
                value={localDescription}
                onChange={(e) => setLocalDescription?.(e.target.value)}
                onBlur={() => {
                  handleBlur?.();
                  setIsDescriptionEditing(false);
                }}
                className="w-full h-full bg-transparent focus:outline-none focus:ring-white text-sm text-gray-600 resize-none"
                placeholder="Add a description..."
                autoFocus
              />
            ) : showEditText && !node.description ? (
              <div 
                className="text-sm text-gray-400 italic cursor-text text-center"
                onClick={() => setIsDescriptionEditing(true)}
              >
                Click to edit description
              </div>
            ) : node.description && (
              <div className="text-sm text-gray-600 text-center">{node.description}</div>
            )}
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