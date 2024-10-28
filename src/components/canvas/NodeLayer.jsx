import React from 'react';
import NodeRenderer from '../node/NodeRenderer';

const NodeLayer = ({ 
  nodes, 
  zoom, 
  onNodeUpdate, 
  focusedNodeId, 
  onNodeFocus,
  onNodeDelete,
  onAIConversation,
  onNodePositionUpdate 
}) => {
  return (
    <div className="absolute inset-0">
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
          onPositionUpdate={onNodePositionUpdate}
        />
      ))}
    </div>
  );
};

export default NodeLayer;