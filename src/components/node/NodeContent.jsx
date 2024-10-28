import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const NodeContent = ({ 
  style, 
  isEditing, 
  node, 
  localTitle, 
  localDescription, 
  handleBlur, 
  setLocalTitle, 
  setLocalDescription, 
  isFocused 
}) => {
  const renderNode = () => {
    switch (style) {
      case 'compact':
        return (
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xs">
            {node.title?.charAt(0) || '?'}
          </div>
        );
      case 'postit':
        return (
          <div className="w-[200px] h-[200px] p-4 bg-yellow-100 rotate-1">
            {isEditing ? (
              <>
                <Input
                  value={localTitle}
                  onChange={(e) => setLocalTitle(e.target.value)}
                  onBlur={handleBlur}
                  className="bg-transparent border-none"
                  placeholder="Title"
                  autoFocus
                />
                <Textarea
                  value={localDescription}
                  onChange={(e) => setLocalDescription(e.target.value)}
                  onBlur={handleBlur}
                  className="bg-transparent border-none resize-none text-sm h-full"
                  placeholder="Write your note here..."
                />
              </>
            ) : (
              <>
                <div className="font-medium">{node.title}</div>
                <div className="text-sm text-gray-600 mt-2">{node.description}</div>
              </>
            )}
          </div>
        );
      default:
        return (
          <div className="min-w-[150px] p-3 bg-white">
            {isEditing ? (
              <>
                <Input
                  value={localTitle}
                  onChange={(e) => setLocalTitle(e.target.value)}
                  onBlur={handleBlur}
                  className="bg-transparent border-none"
                  autoFocus
                />
                <Textarea
                  value={localDescription}
                  onChange={(e) => setLocalDescription(e.target.value)}
                  onBlur={handleBlur}
                  className="bg-transparent border-none resize-none mt-2"
                />
              </>
            ) : (
              <>
                <div className="font-medium">{node.title}</div>
                <div className="text-sm text-gray-600 mt-2">{node.description}</div>
              </>
            )}
          </div>
        );
    }
  };

  return renderNode();
};

export default NodeContent;