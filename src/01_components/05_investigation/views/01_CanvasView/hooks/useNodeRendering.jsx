import React from 'react';
import TwoDNode from '@/components/node/TwoDNode';
import { NODE_STYLES } from '@/utils/nodeStyles';

export const useNodeRendering = ({
  nodes,
  focusedNodeId,
  onNodeFocus,
  onUpdateNode,
  onDeleteNode,
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
          onNodeUpdate={onUpdateNode}
          onFocus={onNodeFocus}
          isFocused={focusedNodeId === node.id}
          onDelete={() => onDeleteNode(node.id)}
          isDraggable={true}
          position={{ x: node.x, y: node.y }}
          onStartConnection={handleConnectionStart}
          onEndConnection={handleConnectionEnd}
          dimensions={style}
        />
      );
    });
  };

  return { renderNodes };
};