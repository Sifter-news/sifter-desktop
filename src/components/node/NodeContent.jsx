import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import { supabase } from '@/config/supabase';
import NodeAvatar from './NodeAvatar';
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

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
  const [isTitleEditing, setIsTitleEditing] = useState(false);

  const saveToDatabase = async (updates) => {
    try {
      const { error } = await supabase
        .from('node')
        .update(updates)
        .eq('id', node.id);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving node:', error);
      toast.error('Failed to save changes');
      throw error;
    }
  };

  const handleTitleSave = async (newTitle) => {
    try {
      await saveToDatabase({ title: newTitle });
      toast.success('Title saved');
    } catch (error) {
      // Error already handled in saveToDatabase
    }
  };

  const handleDescriptionSave = async (newDescription) => {
    try {
      await saveToDatabase({ description: newDescription });
      toast.success('Description saved');
    } catch (error) {
      // Error already handled in saveToDatabase
    }
  };

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

  const descriptionClasses = cn(
    "w-full h-full",
    "bg-transparent",
    "text-sm text-gray-600",
    "resize-none text-center p-0",
    "border-none outline-none ring-0",
    "focus:outline-none focus:ring-0 focus:border-none",
    "hover:outline-none hover:ring-0 hover:border-none",
    "active:outline-none active:ring-0 active:border-none"
  );

  const titleClasses = cn(
    "w-full bg-transparent",
    "font-medium",
    "border-none outline-none ring-0",
    "focus:outline-none focus:ring-0 focus:border-none",
    "hover:outline-none hover:ring-0 hover:border-none",
    "active:outline-none active:ring-0 active:border-none"
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
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-3">
            <NodeAvatar src={node.avatar} alt={node.title} nodeType={node.nodeType} />
            <div className="flex-1 min-w-0">
              {isTitleEditing || isEditing ? (
                <Input
                  type="text"
                  value={localTitle}
                  onChange={(e) => setLocalTitle?.(e.target.value)}
                  onBlur={async () => {
                    if (handleBlur) handleBlur();
                    setIsTitleEditing(false);
                    await handleTitleSave(localTitle);
                  }}
                  className={titleClasses}
                  placeholder="Title"
                  autoFocus
                />
              ) : (
                <div 
                  className="font-medium truncate cursor-text"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsTitleEditing(true);
                  }}
                >
                  {node.title || 'Untitled'}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 min-h-0">
            {isDescriptionEditing ? (
              <Textarea
                value={localDescription}
                onChange={(e) => setLocalDescription?.(e.target.value)}
                onBlur={async () => {
                  if (handleBlur) handleBlur();
                  setIsDescriptionEditing(false);
                  await handleDescriptionSave(localDescription);
                }}
                className={descriptionClasses}
                placeholder="Add a description..."
                autoFocus
              />
            ) : showEditText && !node.description ? (
              <div 
                className={descriptionClasses}
                onClick={() => setIsDescriptionEditing(true)}
              >
                Click to edit description
              </div>
            ) : node.description && (
              <div className={descriptionClasses}>{node.description}</div>
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