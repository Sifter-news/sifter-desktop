import React from 'react';
import NodeRenderer from '../NodeRenderer';

const CanvasNodes = ({ 
  nodes, 
  zoom, 
  onNodeUpdate, 
  focusedNodeId, 
  onNodeFocus, 
  onNodeDelete, 
  onAIConversation, 
  onNodePositionUpdate,
  activeTool 
}) => {
  return (
    <>
      {nodes.map(node => (
        <NodeRenderer
          key={node.id}
          node={node}
          zoom={zoom}
          onNodeUpdate={onNodeUpdate}
          onFocus={onNodeFocus}
          isFocused={focusedNodeId === node.id}
          onDelete={onNodeDelete}
          onAIConversation={onAIConversation}
          onNodePositionUpdate={onNodePositionUpdate}
          isDraggable={activeTool !== 'pan'}
        />
      ))}
    </>
  );
};

export default CanvasNodes;