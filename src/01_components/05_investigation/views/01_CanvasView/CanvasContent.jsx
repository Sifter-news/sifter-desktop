import React from 'react';
import ConnectorLine from '@/components/node/ConnectorLine';
import { useNodeRendering } from './hooks/useNodeRendering.jsx';

const CanvasContent = ({
  contentRef,
  transformStyle,
  handleWheel,
  handleCanvasClick,
  connections,
  activeConnection,
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
  const { renderNodes } = useNodeRendering({
    nodes,
    focusedNodeId,
    onNodeFocus,
    onUpdateNode,
    onDeleteNode,
    zoom,
    handleConnectionStart,
    handleConnectionEnd,
    selectedNodes
  });

  return (
    <div 
      ref={contentRef}
      className="absolute inset-0 will-change-transform scrollbar-hide" 
      style={transformStyle}
      onWheel={handleWheel}
      onClick={handleCanvasClick}
    >
      {connections.map((connection, index) => (
        <ConnectorLine
          key={`connection-${index}`}
          startX={connection.startX}
          startY={connection.startY}
          endX={connection.endX}
          endY={connection.endY}
        />
      ))}

      {activeConnection && (
        <ConnectorLine
          startX={activeConnection.startX}
          startY={activeConnection.startY}
          endX={activeConnection.endX}
          endY={activeConnection.endY}
          isDashed
        />
      )}

      {renderNodes()}
    </div>
  );
};

export default CanvasContent;