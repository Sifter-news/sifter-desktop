import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { Button } from "@/components/ui/button";
import { MessageCircle, Layout, Type, Trash2, ChevronDown } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  const handleStyleChange = (value) => {
    onNodeUpdate(node.id, { visualStyle: value });
    setIsEditing(false);
  };

  const handleTypeChange = (value) => {
    onNodeUpdate(node.id, { nodeType: value });
    setIsEditing(false);
  };

  const handleNodeClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onNodeUpdate(node.id, {
      title: localTitle,
      description: localDescription
    });
  };

  const renderNodeContent = () => {
    const style = node.visualStyle || 'compact';
    
    const getNodeStyle = () => {
      switch (style) {
        case 'compact':
          return (
            <div className="flex items-center p-2">
              <img src="/default-image.png" alt="" className="w-8 h-8 rounded-full" />
            </div>
          );
        case 'expanded':
          return (
            <div className="flex items-start p-2">
              <img src="/default-image.png" alt="" className="w-8 h-8 rounded-full mr-2" />
              <div>
                <div className="font-medium">{node.title}</div>
                <div className="text-sm text-gray-600">{node.description}</div>
              </div>
            </div>
          );
        case 'postit':
          return (
            <div className="p-4 bg-yellow-100">
              <h3 className="font-medium mb-2">{node.title}</h3>
              <p className="text-sm">{node.description}</p>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div onClick={handleNodeClick}>
        {isEditing ? (
          <div className="space-y-2 p-4">
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
              className="flex gap-2 bg-black text-white border-black p-2"
            >
              <Select onValueChange={handleStyleChange} defaultValue={node.visualStyle || 'compact'}>
                <SelectTrigger className="w-[100px] bg-transparent border-none text-white">
                  <Layout className="h-4 w-4 mr-1" />
                  <span className="text-xs">Style</span>
                  <ChevronDown className="h-3 w-3 ml-1" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="expanded">Expanded</SelectItem>
                  <SelectItem value="postit">Post-it</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={handleTypeChange} defaultValue={node.nodeType || 'generic'}>
                <SelectTrigger className="w-[100px] bg-transparent border-none text-white">
                  <Type className="h-4 w-4 mr-1" />
                  <span className="text-xs">Type</span>
                  <ChevronDown className="h-3 w-3 ml-1" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="generic">Generic Note</SelectItem>
                  <SelectItem value="node_person">Person</SelectItem>
                  <SelectItem value="node_organization">Organization</SelectItem>
                  <SelectItem value="node_object">Object</SelectItem>
                  <SelectItem value="node_concept">Concept</SelectItem>
                  <SelectItem value="node_location">Location</SelectItem>
                  <SelectItem value="node_event">Event</SelectItem>
                </SelectContent>
              </Select>

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
                onClick={() => onDelete(node.id)}
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