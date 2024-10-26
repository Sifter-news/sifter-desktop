import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { Button } from "@/components/ui/button";
import { MessageCircle, Layout, Type, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import NodeContent from '@/components/node/NodeContent';

const NodeRenderer = ({ 
  node, 
  onDragStart, 
  zoom, 
  onNodeUpdate, 
  onFocus, 
  isFocused, 
  onAIConversation, 
  onDelete 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [localTitle, setLocalTitle] = useState(node.title);
  const [localDescription, setLocalDescription] = useState(node.description);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleNodeClick = (e) => {
    e.stopPropagation();
    setShowTooltip(true);
    onFocus(node.id);
  };

  const handleBlur = () => {
    onNodeUpdate(node.id, {
      title: localTitle,
      description: localDescription
    });
  };

  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
    onNodeUpdate(node.id, {
      height: !isExpanded ? node.originalHeight || 200 : 40
    });
  };

  return (
    <div className="group">
      <Rnd
        size={{ width: node.width, height: node.height }}
        position={{ x: node.x, y: node.y }}
        onDragStart={(e) => onDragStart(e, node.id)}
        scale={zoom}
        className={`relative transition-all duration-200 ${
          isFocused 
            ? 'ring-2 ring-blue-500 ring-offset-2 shadow-lg' 
            : 'hover:ring-1 hover:ring-blue-300 hover:ring-offset-1 hover:shadow-md'
        }`}
        onClick={handleNodeClick}
      >
        <div className="relative h-full">
          <NodeContent
            style={node.visualStyle}
            isEditing={false}
            node={node}
            localTitle={localTitle}
            localDescription={localDescription}
            handleBlur={handleBlur}
            setLocalTitle={setLocalTitle}
            setLocalDescription={setLocalDescription}
            handleNodeClick={handleNodeClick}
            isExpanded={isExpanded}
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-1 right-1 p-1 h-6 w-6"
            onClick={toggleExpand}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </Rnd>
    </div>
  );
};

export default NodeRenderer;