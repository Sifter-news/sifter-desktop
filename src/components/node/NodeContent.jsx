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
  isFocused 
}) => {
  const getNodeStyle = () => {
    const focusClasses = isFocused 
      ? 'ring-2 ring-white scale-[1.02]' 
      : 'hover:ring-1 hover:ring-blue-300 hover:ring-offset-1 hover:scale-[1.01]';

    switch (style) {
      case 'compact':
        return (
          <div className={`w-10 h-10 p-1 bg-white rounded-full shadow-sm transition-all duration-200 ${focusClasses}`}>
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs">
              {node.title?.charAt(0) || '?'}
            </div>
          </div>
        );
      case 'expanded':
        return (
          <div className={`min-w-[200px] p-4 bg-white rounded-lg shadow-md transition-all duration-200 ${focusClasses}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                {node.title?.charAt(0) || '?'}
              </div>
              <div>
                <div className="font-medium">{node.title}</div>
                <div className="text-sm text-gray-600 line-clamp-2">{node.description}</div>
              </div>
            </div>
          </div>
        );
      case 'postit':
        return (
          <div className={`w-[200px] h-[200px] p-4 bg-yellow-100 rounded-sm shadow-lg transition-all duration-200 transform rotate-1 ${focusClasses}`}>
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
              <div className="h-full flex flex-col">
                <h3 className="font-medium mb-2 font-handwritten">{node.title}</h3>
                <p className="text-sm text-gray-700 font-handwritten cursor-text overflow-hidden" 
                   onClick={(e) => {
                     e.stopPropagation();
                     setLocalDescription(node.description);
                     setLocalTitle(node.title);
                     handleNodeClick(e);
                   }}>
                  {node.description}
                </p>
              </div>
            )}
          </div>
        );
      default: // default style
        return (
          <div className={`min-w-[150px] p-3 bg-white rounded-lg shadow-sm transition-all duration-200 ${focusClasses}`}>
            {isEditing ? (
              <div className="space-y-2">
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
            ) : (
              <div>
                <div className="font-medium">{node.title}</div>
                <div className="text-sm text-gray-600">{node.description}</div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div onClick={handleNodeClick}>
      {getNodeStyle()}
    </div>
  );
};

export default NodeContent;