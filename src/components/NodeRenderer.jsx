import React, { useState, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import { Button } from "@/components/ui/button";
import { MessageCircle, Layout, Type, Trash2, ChevronDown } from 'lucide-react';
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
} from "@/components/ui/tooltip";
import ConnectionDot from './node/ConnectionDot';
import NodeContent from './node/NodeContent';

const NodeRenderer = ({ 
  node, 
  onDragStart, 
  zoom, 
  onNodeUpdate, 
  onFocus, 
  isFocused, 
  onAIConversation, 
  onDelete,
  onAddNode 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(node.title);
  const [localDescription, setLocalDescription] = useState(node.description);
  const [hoveredDot, setHoveredDot] = useState(null);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const handleDragStart = useCallback((e) => {
    if (e.altKey) {
      setIsDuplicating(true);
      // Create a new node as a copy
      const newNode = {
        ...node,
        id: Date.now().toString(),
        x: e.clientX / zoom,
        y: e.clientY / zoom,
      };
      onAddNode(newNode);
    } else {
      onDragStart(e, node.id);
    }
  }, [node, onDragStart, onAddNode, zoom]);

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

  return (
    <div className="group">
      <Rnd
        size={{ width: node.width, height: node.height }}
        position={{ x: node.x, y: node.y }}
        onDragStart={handleDragStart}
        scale={zoom}
        className="relative"
      >
        <NodeContent
          style={node.visualStyle}
          isEditing={isEditing}
          node={node}
          localTitle={localTitle}
          localDescription={localDescription}
          handleBlur={handleBlur}
          setLocalTitle={setLocalTitle}
          setLocalDescription={setLocalDescription}
          handleNodeClick={handleNodeClick}
        />
        {['top', 'bottom', 'left', 'right'].map(position => (
          <ConnectionDot
            key={position}
            position={position}
            isHovered={hoveredDot === position}
            onHover={() => setHoveredDot(position)}
            onLeaveHover={() => setHoveredDot(null)}
            onStartConnection={() => console.log(`Starting connection from ${position}`)}
          />
        ))}
        <TooltipProvider delayDuration={500}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute inset-0 cursor-move" />
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              className="flex gap-2 bg-black text-white border-black p-2"
            >
              <Select onValueChange={handleStyleChange} defaultValue={node.visualStyle || 'expanded'}>
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