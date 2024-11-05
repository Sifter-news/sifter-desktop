import React from 'react';
import TwoDNode from './TwoDNode';
import NodeRenderer from './NodeRenderer';
import { NODE_STYLES } from '@/utils/nodeStyles';

const Node2D = ({
  nodes,
  onNodeUpdate,
  onNodeDelete,
  focusedNodeId,
  onNodeFocus,
  zoom,
  handleConnectionStart,
  handleConnectionEnd
}) => {
  const renderNodes = () => {
    return nodes.map(node => {
      const style = NODE_STYLES[node.visualStyle || 'default'];
      return (
        <TwoDNode
          key={node.id}
          node={{
            ...node,
            color: node.color || 'bg-white' // Explicitly set white as default background
          }}
          zoom={zoom}
          onNodeUpdate={onNodeUpdate}
          onFocus={onNodeFocus}
          isFocused={focusedNodeId === node.id}
          onDelete={() => onNodeDelete(node.id)}
          isDraggable={true}
          position={{ x: node.x, y: node.y }}
          onStartConnection={handleConnectionStart}
          onEndConnection={handleConnectionEnd}
          dimensions={style}
        />
      );
    });
  };

  return (
    <div>
      {renderNodes()}
      <NodeRenderer
        nodes={nodes}
        onNodeUpdate={onNodeUpdate}
        onNodeDelete={onNodeDelete}
        focusedNodeId={focusedNodeId}
        onNodeFocus={onNodeFocus}
      />
    </div>
  );
};

export default Node2D;
