import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { Button } from "@/components/ui/button";
import { MessageCircle, Type, Trash2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const NodeRenderer = ({ node, onDragStart, zoom, onNodeUpdate, onFocus, isFocused, onAIConversation, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(node.title);
  const [localDescription, setLocalDescription] = useState(node.description);

  const handleVisualTypeChange = (value) => {
    onNodeUpdate(node.id, { visualType: value });
    setIsEditing(false);
  };

  const handleNodeClick = () => {
    if (node.visualType === 'postit') {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    onNodeUpdate(node.id, {
      title: localTitle,
      description: localDescription
    });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(node.id);
  };

  const renderNodeContent = () => {
    if (node.visualType === 'pill') {
      return (
        <div className="w-full h-full p-4 bg-white rounded-full flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200 mr-2" />
          <div className="flex-grow">
            <h3 className="font-medium">{node.title}</h3>
            <p className="text-sm text-gray-600">{node.description}</p>
          </div>
        </div>
      );
    } else {
      const postitStyle = `w-full h-full p-4 ${node.color || 'bg-yellow-200'} shadow-md transform rotate-1`;
      
      return (
        <div className={postitStyle} onClick={handleNodeClick}>
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
            <>
              <h3 className="font-medium mb-2">{node.title}</h3>
              <p className="text-sm">{node.description}</p>
            </>
          )}
        </div>
      );
    }
  };

  return (
    <div className="group">
      <Rnd
        size={{ width: node.width, height: node.height }}
        position={{ x: node.x, y: node.y }}
        onDragStart={(e) => onDragStart(e, node.id)}
        scale={zoom}
        className="relative"
      >
        {renderNodeContent()}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute inset-0 cursor-move" />
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              className="flex gap-2 bg-black text-white border-black"
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-gray-800"
                onClick={() => handleVisualTypeChange('pill')}
              >
                <Type className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-gray-800"
                onClick={() => handleVisualTypeChange('postit')}
              >
                <Type className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-gray-800"
                onClick={() => onAIConversation(node)}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-gray-800"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Rnd>
    </div>
  );
};

export default NodeRenderer;