import React, { useState, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ConnectionDot from './ConnectionDot';
import NodeContent from './NodeContent';
import NodeEditModal from './NodeEditModal';
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
  const [hoveredDot, setHoveredDot] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleStyleChange = useCallback((value) => {
    onNodeUpdate(node.id, { visualStyle: value });
    setIsEditing(false);
  }, [node.id, onNodeUpdate]);

  const handleTypeChange = useCallback((value) => {
    onNodeUpdate(node.id, { nodeType: value });
    setIsEditing(false);
  }, [node.id, onNodeUpdate]);

  const handleNodeClick = useCallback((e) => {
    e.stopPropagation();
    onFocus(node.id);
  }, [node.id, onFocus]);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    onNodeUpdate(node.id, {
      title: localTitle,
      description: localDescription
    });
  }, [node.id, localTitle, localDescription, onNodeUpdate]);

  const handleEdit = useCallback(() => {
    setShowEditModal(true);
  }, []);

  const styles = {
    compact: "Compact",
    expanded: "Expanded",
    postit: "Post-it"
  };

  const nodeTypes = {
    generic: "Generic Note",
    node_person: "Person",
    node_organization: "Organization",
    node_object: "Object",
    node_concept: "Concept",
    node_location: "Location",
    node_event: "Event"
  };

  return (
    <div className="group">
      <Rnd
        size={{ width: node.width, height: node.height }}
        position={{ x: node.x, y: node.y }}
        onDragStart={(e) => onDragStart(e, node.id)}
        scale={zoom}
        className={`relative rounded-lg ${
          isFocused 
            ? 'ring-2 ring-blue-500/20 ring-offset-2 shadow-lg scale-[1.02]' 
            : 'hover:ring-1 hover:ring-blue-300/20 hover:ring-offset-1 hover:shadow-md hover:scale-[1.01]'
        }`}
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
            onStartConnection={() => {}}
          />
        ))}
        <TooltipProvider delayDuration={500}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="absolute inset-0 cursor-move" />
            </TooltipTrigger>
            <TooltipContent 
              side="top" 
              className="bg-black text-white border-black p-2"
            >
              <TooltipButtons
                styles={styles}
                nodeTypes={nodeTypes}
                handleStyleChange={handleStyleChange}
                handleTypeChange={handleTypeChange}
                onAIConversation={onAIConversation}
                onDelete={onDelete}
                node={node}
                onEdit={handleEdit}
              />
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Rnd>
      <NodeEditModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        node={node}
        onUpdate={onNodeUpdate}
      />
    </div>
  );
};

export default NodeRenderer;