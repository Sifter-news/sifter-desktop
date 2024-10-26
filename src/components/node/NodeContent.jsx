import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const NodeContent = ({ style, isEditing, node, localTitle, localDescription, handleBlur, setLocalTitle, setLocalDescription, handleNodeClick }) => {
  const getNodeStyle = () => {
    switch (style) {
      case 'compact':
        return (
          <div className="flex flex-col justify-center p-4 bg-white rounded-lg min-w-[120px]">
            <img src="/default-image.png" alt="" className="w-8 h-8 rounded-full mb-1 mx-auto" />
            <div className="text-sm font-medium text-center">{node.title}</div>
          </div>
        );
      case 'expanded':
        return (
          <div className="flex items-center p-4 bg-white rounded-lg min-w-[200px]">
            <img src="/default-image.png" alt="" className="w-8 h-8 rounded-full mr-2" />
            <div className="flex-1">
              <div className="font-medium">{node.title}</div>
              <div className="text-sm text-gray-600">{node.description}</div>
            </div>
          </div>
        );
      case 'postit':
        return (
          <div className="w-full h-full p-4 bg-yellow-100 rounded-sm shadow-md">
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
          <div className="flex items-center p-4 bg-white rounded-lg min-w-[200px]">
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
    <div onClick={handleNodeClick} className="w-full h-full">
      {isEditing ? (
        <div className="h-full p-4 bg-white rounded-lg">
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