import React, { useState, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ConnectionDot from './ConnectionDot';
import ConnectorLine from './ConnectorLine';
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
  const [isDrawingConnection, setIsDrawingConnection] = useState(false);
  const [connectionStart, setConnectionStart] = useState(null);
  const [connectionEnd, setConnectionEnd] = useState({ x: 0, y: 0 });

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

  const handleStartConnection = (position) => {
    const rect = document.querySelector(`[data-node-id="${node.id}"]`).getBoundingClientRect();
    let startX, startY;
    
    switch (position) {
      case 'top':
        startX = rect.left + rect.width / 2;
        startY = rect.top;
        break;
      case 'bottom':
        startX = rect.left + rect.width / 2;
        startY = rect.bottom;
        break;
      case 'left':
        startX = rect.left;
        startY = rect.top + rect.height / 2;
        break;
      case 'right':
        startX = rect.right;
        startY = rect.top + rect.height / 2;
        break;
    }

    setConnectionStart({ x: startX, y: startY });
    setConnectionEnd({ x: startX, y: startY });
    setIsDrawingConnection(true);

    const handleMouseMove = (e) => {
      setConnectionEnd({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDrawingConnection(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="group" data-node-id={node.id}>
      <Rnd
        size={{ width: node.width, height: node.height }}
        position={{ x: node.x, y: node.y }}
        onDragStart={(e) => onDragStart(e, node.id)}
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
            onStartConnection={handleStartConnection}
          />
        ))}
      </Rnd>
      {isDrawingConnection && connectionStart && (
        <ConnectorLine
          startX={connectionStart.x}
          startY={connectionStart.y}
          endX={connectionEnd.x}
          endY={connectionEnd.y}
        />
      )}
    </div>
  );
};

export default NodeRenderer;
