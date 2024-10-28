import React from 'react';
import NodeRenderer from '../node/NodeRenderer';

const CanvasGrid = ({ 
  zoom, 
  position, 
  nodes, 
  onNodeUpdate, 
  onNodeFocus, 
  focusedNodeId, 
  onDelete, 
  onAIConversation, 
  onNodePositionUpdate, 
  activeTool 
}) => {
  return (
    <div 
      className="absolute inset-0" 
      style={{
        width: '5000px',
        height: '5000px',
        border: '2px solid rgba(255, 255, 255, 0.2)',
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
        backgroundSize: '120px 120px',
        transformOrigin: '0 0',
        transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
      }}
    >
      {nodes.map(node => (
        <NodeRenderer
          key={node.id}
          node={node}
          zoom={zoom}
          onNodeUpdate={onNodeUpdate}
          onFocus={onNodeFocus}
          isFocused={focusedNodeId === node.id}
          onDelete={onDelete}
          onAIConversation={onAIConversation}
          onNodePositionUpdate={onNodePositionUpdate}
          isDraggable={activeTool !== 'pan'}
        />
      ))}
    </div>
  );
};

export default CanvasGrid;