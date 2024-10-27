import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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
  isFocused,
  dimensions = { width: 200, height: 150 } // Add default dimensions
}) => {
  const getNodeStyle = () => {
    const focusClasses = isFocused 
      ? 'ring-2 ring-blue-500 ring-offset-[-2px] scale-[1.02]' 
      : 'hover:ring-1 hover:ring-blue-300 hover:ring-offset-[-1px] hover:scale-[1.01]';

    const nodeStyles = {
      width: dimensions?.width || 200,
      height: dimensions?.height || 150
    };

    switch (style) {
      case 'compact':
        return (
          <div 
            className={cn(
              "p-1 bg-white rounded-full m-1 transition-all duration-200",
              focusClasses
            )}
            style={nodeStyles}
          >
            <img src="/default-image.png" alt="" className="w-8 h-8 rounded-full" />
          </div>
        );
      case 'expanded':
        return (
          <div 
            className={cn(
              "flex items-center p-2 bg-white rounded-lg m-1 transition-all duration-200",
              focusClasses
            )}
            style={nodeStyles}
          >
            <img src="/default-image.png" alt="" className="w-8 h-8 rounded-full mr-2" />
            <div>
              <div className="font-medium">{node.title}</div>
              <div className="text-sm text-gray-600">{node.description}</div>
            </div>
          </div>
        );
      case 'postit':
        return (
          <div 
            className={cn(
              "p-4 bg-yellow-100 rounded-sm shadow-md m-1 transition-all duration-200",
              focusClasses
            )}
            style={nodeStyles}
          >
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
                  className="flex-1 bg-transparent border-none focus:ring-0 resize-none text-sm"
                />
              </div>
            ) : (
              <>
                <h3 className="font-medium mb-2">{node.title}</h3>
                <p className="text-sm">{node.description}</p>
              </>
            )}
          </div>
        );
      default:
        return (
          <div 
            className={cn(
              "flex items-center p-2 bg-white rounded-lg m-1 transition-all duration-200",
              focusClasses
            )}
            style={nodeStyles}
          >
            <img src="/default-image.png" alt="" className="w-8 h-8 rounded-full mr-2" />
            <div>
              <div className="font-medium">{node.title}</div>
              <div className="text-sm text-gray-600">{node.description}</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div onClick={handleNodeClick} className="p-4">
      {isEditing ? (
        <div className={cn(
          "space-y-2 p-4 bg-white rounded-lg m-1 transition-all duration-200",
          isFocused ? 'ring-2 ring-blue-500 ring-offset-[-2px]' : 'hover:ring-1 hover:ring-blue-300 hover:ring-offset-[-1px]'
        )}>
          <Input
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            onBlur={handleBlur}
            className="bg-transparent border-none focus:ring-0"
            autoFocus
          />
          <Textarea
            value={localDescription}
            onChange={(e) => setLocalDescription(e.target.value)}
            onBlur={handleBlur}
            className="bg-transparent border-none focus:ring-0 resize-none"
          />
        </div>
      ) : getNodeStyle()}
    </div>
  );
};

export default NodeContent;