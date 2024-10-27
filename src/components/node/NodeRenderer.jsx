import React, { useState, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import NodeContent from './NodeContent';
import TooltipButtons from './TooltipButtons';
import { cn } from "@/lib/utils";

const getNodeDimensions = (type) => {
  switch(type) {
    case 'compact': return { width: 150, height: 100 };
    case 'expanded': return { width: 300, height: 150 };
    case 'postit': return { width: 240, height: 200 };
    default: return { width: 200, height: 150 };
  }
};

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
  const initialDimensions = getNodeDimensions(node.visualStyle);
  const [dimensions, setDimensions] = useState(initialDimensions);
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(node.title);
  const [localDescription, setLocalDescription] = useState(node.description);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleStyleChange = (value) => {
    const newDimensions = getNodeDimensions(value);
    setDimensions(newDimensions);
    onNodeUpdate(node.id, { 
      visualStyle: value,
      width: newDimensions.width,
      height: newDimensions.height
    });
    setIsEditing(false);
  };

  const handleTypeChange = (value) => {
    onNodeUpdate(node.id, { nodeType: value });
    setIsEditing(false);
  };

  const handleNodeClick = (e) => {
    e.stopPropagation();
    setShowTooltip(true);
    onFocus(node.id);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onNodeUpdate(node.id, {
      title: localTitle,
      description: localDescription
    });
  };

  const handleResize = (e, direction, ref, delta, position) => {
    const newWidth = Math.max(dimensions.width + delta.width, initialDimensions.width);
    const newHeight = Math.max(dimensions.height + delta.height, initialDimensions.height);
    
    setDimensions({ width: newWidth, height: newHeight });
    onNodeUpdate(node.id, { 
      width: newWidth,
      height: newHeight,
      x: position.x,
      y: position.y
    });
  };

  React.useEffect(() => {
    if (!isFocused) {
      setShowTooltip(false);
    }
  }, [isFocused]);

  return (
    <div className="group">
      <Rnd
        size={{ width: dimensions.width, height: dimensions.height }}
        position={{ x: node.x, y: node.y }}
        onDragStart={(e) => onDragStart(e, node.id)}
        onResize={handleResize}
        scale={zoom}
        minWidth={initialDimensions.width}
        minHeight={initialDimensions.height}
        className={cn(
          "relative transition-all duration-200",
          isFocused && "ring-2 ring-blue-500 ring-offset-[-2px] shadow-lg"
        )}
      >
        <div 
          className={cn(
            "w-full h-full rounded-lg overflow-hidden",
            isFocused && "transform scale-[1.02]"
          )}
          onClick={handleNodeClick}
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
            isFocused={isFocused}
            dimensions={dimensions}
          />
        </div>
        <TooltipProvider>
          <Tooltip open={showTooltip}>
            <TooltipTrigger asChild>
              <div className="absolute inset-0 cursor-move" />
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              className="bg-black text-white border-black p-2"
            >
              <TooltipButtons
                styles={{
                  compact: "Compact",
                  expanded: "Expanded",
                  postit: "Post-it"
                }}
                nodeTypes={{
                  generic: "Generic Note",
                  node_person: "Person",
                  node_organization: "Organization",
                  node_object: "Object",
                  node_concept: "Concept",
                  node_location: "Location",
                  node_event: "Event"
                }}
                handleStyleChange={handleStyleChange}
                handleTypeChange={handleTypeChange}
                onAIConversation={onAIConversation}
                onDelete={onDelete}
                node={node}
                onEdit={() => setIsEditing(true)}
              />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Rnd>
    </div>
  );
};

export default NodeRenderer;