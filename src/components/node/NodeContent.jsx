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
  handleNodeClick,
  isExpanded 
}) => {
  const getNodeStyle = () => {
    const baseClasses = "transition-all duration-200 ease-in-out";
    const expandedClasses = isExpanded ? "opacity-100" : "opacity-0 h-0 overflow-hidden";

    switch (style) {
      case 'compact':
        return (
          <div className={`w-10 h-10 p-1 bg-white rounded-full ring-offset-background ${baseClasses}`}>
            <img src="/default-image.png" alt="" className="w-8 h-8 rounded-full" />
          </div>
        );
      case 'expanded':
        return (
          <div className={`flex flex-col p-2 bg-white rounded-lg ring-offset-background ${baseClasses}`}>
            <div className="font-medium">{node.title}</div>
            <div className={`text-sm text-gray-600 ${expandedClasses}`}>{node.description}</div>
          </div>
        );
      case 'postit':
        return (
          <div className={`w-full h-full p-4 bg-yellow-100 rounded-sm shadow-md ${baseClasses}`}>
            {isEditing ? (
              <div className="h-full flex flex-col gap-2">
                <Input
                  value={localTitle}
                  onChange={(e) => setLocalTitle(e.target.value)}
                  onBlur={handleBlur}
                  className="bg-transparent border-none focus:ring-0 font-medium"
                />
                <Textarea
                  value={localDescription}
                  onChange={(e) => setLocalDescription(e.target.value)}
                  onBlur={handleBlur}
                  className={`flex-1 bg-transparent border-none focus:ring-0 resize-none text-sm ${expandedClasses}`}
                />
              </div>
            ) : (
              <>
                <h3 className="font-medium mb-2">{node.title}</h3>
                <p className={`text-sm ${expandedClasses}`}>{node.description}</p>
              </>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div onClick={handleNodeClick} className="h-full">
      {getNodeStyle()}
    </div>
  );
};

export default NodeContent;