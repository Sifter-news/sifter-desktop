import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const NodeContent = ({ style, isEditing, node, localTitle, localDescription, handleBlur, setLocalTitle, setLocalDescription, handleNodeClick }) => {
  const getNodeStyle = () => {
    switch (style) {
      case 'compact':
        return (
          <div className="flex flex-col items-center p-2 bg-white rounded-lg">
            <img src="/default-image.png" alt="" className="w-8 h-8 rounded-full mb-1" />
            <div className="text-sm font-medium text-center">{node.title}</div>
          </div>
        );
      case 'expanded':
        return (
          <div className="flex items-start p-2 bg-white rounded-lg">
            <img src="/default-image.png" alt="" className="w-8 h-8 rounded-full mr-2" />
            <div className="text-center w-full">
              <div className="font-medium">{node.title}</div>
              <div className="text-sm text-gray-600">{node.description}</div>
            </div>
          </div>
        );
      case 'postit':
        return (
          <div className="p-4 bg-yellow-100 rounded-lg text-center">
            <h3 className="font-medium mb-2">{node.title}</h3>
            <p className="text-sm">{node.description}</p>
          </div>
        );
      default:
        return (
          <div className="flex items-start p-2 bg-white rounded-lg">
            <img src="/default-image.png" alt="" className="w-8 h-8 rounded-full mr-2" />
            <div className="text-center w-full">
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
        <div className="space-y-2 p-4 bg-white rounded-lg">
          <Input
            value={localTitle}
            onChange={(e) => setLocalTitle(e.target.value)}
            onBlur={handleBlur}
            className="bg-transparent border-none focus:ring-0 text-center"
            autoFocus
          />
          <Textarea
            value={localDescription}
            onChange={(e) => setLocalDescription(e.target.value)}
            onBlur={handleBlur}
            className="bg-transparent border-none focus:ring-0 resize-none text-center"
          />
        </div>
      ) : getNodeStyle()}
    </div>
  );
};

export default NodeContent;