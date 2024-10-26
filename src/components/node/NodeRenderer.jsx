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
  const [isEditing, setIsEditing] = useState(false);
  const [localTitle, setLocalTitle] = useState(node.title);
  const [localDescription, setLocalDescription] = useState(node.description);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleStyleChange = (value) => {
    onNodeUpdate(node.id, { visualStyle: value });
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

  React.useEffect(() => {
    if (!isFocused) {
      setShowTooltip(false);
    }
  }, [isFocused]);

  const isCompact = node.visualStyle === 'compact';

  return (
    <div className="group">
      <Rnd
        size={{ width: isCompact ? 40 : node.width, height: isCompact ? 40 : node.height }}
        position={{ x: node.x, y: node.y }}
        onDragStart={(e) => onDragStart(e, node.id)}
        scale={zoom}
        className="relative"
      >
        <div 
          className={`w-full h-full ${
            isFocused 
              ? 'ring-2 ring-blue-500 ring-offset-0' 
              : 'hover:ring-1 hover:ring-blue-300 hover:ring-offset-0'
          } transition-all duration-200 ease-in-out rounded-lg overflow-hidden`}
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