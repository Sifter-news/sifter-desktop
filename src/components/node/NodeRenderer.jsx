import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import NodeContent from './NodeContent';
import TooltipButtons from './TooltipButtons';

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
  const [showTooltip, setShowTooltip] = useState(false);

  const handleNodeClick = (e) => {
    e.stopPropagation();
    setShowTooltip(true);
    onFocus(node.id);
  };

  React.useEffect(() => {
    if (!isFocused) {
      setShowTooltip(false);
    }
  }, [isFocused]);

  return (
    <div className="group">
      <Rnd
        size={{ width: node.width, height: node.height }}
        position={{ x: node.x, y: node.y }}
        onDragStart={(e) => onDragStart(e, node.id)}
        scale={zoom}
        className={`relative ${
          isFocused ? 'ring-2 ring-blue-500' : ''
        }`}
      >
        <div 
          className="w-full h-full rounded-lg overflow-hidden"
          onClick={handleNodeClick}
        >
          <NodeContent
            style={node.visualStyle}
            node={node}
            handleNodeClick={handleNodeClick}
            isFocused={isFocused}
          />
        </div>
        <TooltipProvider>
          <Tooltip open={showTooltip}>
            <TooltipTrigger asChild>
              <div className="absolute inset-0 cursor-move" />
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              className="p-0 border-0 bg-transparent"
              sideOffset={5}
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
                handleStyleChange={(style) => onNodeUpdate(node.id, { visualStyle: style })}
                handleTypeChange={(type) => onNodeUpdate(node.id, { nodeType: type })}
                onAIConversation={() => onAIConversation(node)}
                onDelete={onDelete}
                node={node}
                onUpdate={onNodeUpdate}
              />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Rnd>
    </div>
  );
};

export default NodeRenderer;