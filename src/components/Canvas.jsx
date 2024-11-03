import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDebug } from '@/contexts/DebugContext';
import TwoDNode from './node/TwoDNode';
import CanvasBackground from './canvas/CanvasBackground';
import CanvasControls from './canvas/CanvasControls';
import ConnectorLine from './node/ConnectorLine';
import { copyNode, pasteNode } from '@/utils/clipboardUtils';

const Canvas = forwardRef(({ 
  nodes, 
  setNodes, 
  zoom, 
  position, 
  activeTool,
  setActiveTool,
  handlePanStart, 
  handlePanMove, 
  handlePanEnd,
  handleWheel,
  handleZoom,
  onNodeUpdate,
  focusedNodeId,
  onNodeFocus,
  onNodeDelete,
  onDragOver,
  onDrop,
  onAIConversation,
  onNodePositionUpdate,
  setPosition
}, ref) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState(null);
  const [isPanning, setIsPanning] = useState(false);
  const [connections, setConnections] = useState([]);
  const [activeConnection, setActiveConnection] = useState(null);
  const { setDebugData } = useDebug();

  // Calculate the visible canvas area
  const canvasWidth = 10000;
  const canvasHeight = 10000;
  const centerOffsetX = -canvasWidth / 2;
  const centerOffsetY = -canvasHeight / 2;

  const handleNodeDrag = useCallback((nodeId, dragData) => {
    // Convert screen coordinates back to canvas coordinates
    const canvasX = dragData.x - canvasWidth/2;
    const canvasY = dragData.y - canvasHeight/2;
    
    onNodeUpdate(nodeId, {
      x: canvasX,
      y: canvasY
    });
  }, [onNodeUpdate, canvasWidth, canvasHeight]);

  const transformStyle = {
    transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
    transformOrigin: '0 0',
  };

  return (
    <div 
      className="w-full h-full overflow-hidden cursor-auto relative"
      onMouseDown={handlePanStart}
      onMouseMove={handlePanMove}
      onMouseUp={handlePanEnd}
      onMouseLeave={handlePanEnd}
      onWheel={handleWheel}
      ref={ref}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{ cursor: isPanning ? 'grabbing' : activeTool === 'pan' ? 'grab' : 'default' }}
    >
      <CanvasBackground zoom={zoom} position={position} />
      
      <div 
        className="absolute inset-0" 
        style={{
          ...transformStyle,
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          left: `${centerOffsetX}px`,
          top: `${centerOffsetY}px`
        }}
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

        {nodes.map(node => (
          <TwoDNode
            key={node.id}
            node={node}
            zoom={zoom}
            onNodeUpdate={handleNodeDrag}
            onFocus={onNodeFocus}
            isFocused={focusedNodeId === node.id}
            onDelete={() => onNodeDelete(node.id)}
            isDraggable={activeTool !== 'pan'}
            position={{ 
              x: node.x + canvasWidth/2, 
              y: node.y + canvasHeight/2 
            }}
            onStartConnection={startConnection}
          />
        ))}
      </div>

      <CanvasControls 
        zoom={zoom}
        handleZoom={handleZoom}
        setPosition={setPosition}
      />
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;