import React from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const NodeContent = ({ style, isEditing, node, localTitle, localDescription, handleBlur, setLocalTitle, setLocalDescription, handleNodeClick }) => {
  const getNodeStyle = () => {
    switch (style) {
      case 'compact':
        return (
          <div className="w-10 h-10 p-1 bg-white rounded-full inline-flex">
            <img src="/default-image.png" alt="" className="w-8 h-8 rounded-full" />
          </div>
        );
      case 'expanded':
        return (
          <div className="inline-flex items-center p-2 bg-white rounded-lg">
            <img src="/default-image.png" alt="" className="w-8 h-8 rounded-full mr-2" />
            <div className="max-w-[200px]">
              <div className="font-medium">{node.title}</div>
              <div className="text-sm text-gray-600">{node.description}</div>
            </div>
          </div>
        );
      case 'postit':
        return (
          <div className="inline-block w-[240px] h-[200px] p-4 bg-yellow-100 rounded-sm shadow-md">
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
          <div className="inline-flex items-center p-2 bg-white rounded-lg">
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
    <div onClick={handleNodeClick} className="p-4 inline-block">
      {isEditing ? (
        <div className="space-y-2 p-4 bg-white rounded-lg inline-block">
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