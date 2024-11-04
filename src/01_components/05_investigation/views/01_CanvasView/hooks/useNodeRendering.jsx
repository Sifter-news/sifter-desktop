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
  selectedNodes
}) => {
  const renderNodes = () => {
    return nodes.map((node) => {
      const isSelected = selectedNodes?.some(selectedNode => selectedNode.id === node.id);
      const isFocused = focusedNodeId === node.id;

      return (
        <TwoDNode
          key={node.id}
          node={node}
          onFocus={onNodeFocus}
          onUpdate={onUpdateNode}
          onDelete={onDeleteNode}
          isFocused={isFocused}
          isSelected={isSelected}
          zoom={zoom}
          onStartConnection={handleConnectionStart}
          onEndConnection={handleConnectionEnd}
        />
      );
    });
  };

  return { renderNodes };
};