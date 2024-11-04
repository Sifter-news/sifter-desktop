import React from 'react';
import TwoDNode from '@/components/node/TwoDNode';

export const useNodeRendering = ({
  nodes,
  focusedNodeId,
  onNodeFocus,
  onUpdateNode,
  onDeleteNode,
  zoom,
  handleConnectionStart,
  handleConnectionEnd,
  NODE_STYLES
}) => {
  const renderNodes = () => {
    return nodes.map(node => {
      const style = NODE_STYLES[node.visualStyle || 'default'];
      return (
        <TwoDNode
          key={node.id}
          node={{
            ...node,
            color: node.color || 'bg-white'
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
          showTooltip={focusedNodeId === node.id} // Add this prop
        />
      );
    });
  };

  return { renderNodes };
};