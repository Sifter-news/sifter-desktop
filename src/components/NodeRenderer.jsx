import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MessageCircle, Type, Database, Palette, MoreVertical, Trash2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NodeRenderer = ({ node, onDragStart, zoom, onNodeUpdate, onFocus, isFocused, onAIConversation, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(node.title);
  const [localDescription, setLocalDescription] = useState(node.description);

  const handleVisualTypeChange = (value) => {
    onNodeUpdate(node.id, { visualType: value });
    setIsEditing(false);
  };

  const handleDataTypeChange = (value) => {
    onNodeUpdate(node.id, { type: value });
  };

  const handleColorChange = (value) => {
    onNodeUpdate(node.id, { color: value });
  };

  const handleAIClick = () => {
    onFocus(node.id);
    onAIConversation(node);
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
    <Rnd
      size={{ width: node.width, height: node.height }}
      position={{ x: node.x, y: node.y }}
      onDragStart={(e) => onDragStart(e, node.id)}
      scale={zoom}
      className="group relative"
    >
      {renderNodeContent()}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 bg-white bg-opacity-80 rounded-full hover:bg-opacity-100">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleVisualTypeChange('pill')}>
                <Type className="mr-2 h-4 w-4" />
                <span>Pill Style</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleVisualTypeChange('postit')}>
                <Type className="mr-2 h-4 w-4" />
                <span>Post-it Style</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleAIClick}>
                <MessageCircle className="mr-2 h-4 w-4" />
                <span>AI Conversation</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete Node</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Rnd>
  );
};

export default NodeRenderer;