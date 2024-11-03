import React, { useRef, useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { useDebug } from '@/contexts/DebugContext';
import TwoDNode from '@/components/node/TwoDNode';
import CanvasBackground from '@/components/canvas/CanvasBackground';
import CanvasControls from './CanvasControls';
import ConnectorLine from '@/components/node/ConnectorLine';
import { copyNode, pasteNode } from '@/utils/clipboardUtils';
import { useZoomPan } from '@/hooks/useZoomPan';
import { handleNodeDrag } from './handlers/nodeHandlers';
import { handleCanvasInteraction } from './handlers/canvasHandlers';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useConnectionHandling } from './hooks/useConnectionHandling';

const CanvasView = ({ 
  nodes, 
  setNodes, 
  onAddNode, 
  onUpdateNode, 
  onDeleteNode,
  focusedNodeId,
  onNodeFocus 
}) => {
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const [activeTool, setActiveTool] = useState('select');
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState(null);
  const [isPanning, setIsPanning] = useState(false);
  const { setDebugData } = useDebug();
  const { zoom, position, handleZoom, handlePanStart, handlePanMove, handlePanEnd, handleWheel } = useZoomPan();
  const { connections, activeConnection, handleConnectionStart, handleConnectionEnd } = useConnectionHandling();

  const handleKeyDown = useKeyboardShortcuts({
    focusedNodeId,
    nodes,
    onDeleteNode,
    setNodes,
    setNodeToDelete,
    setShowDeleteConfirmation
  });

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const { handleMouseDown, handleMouseMove, handleMouseUp } = handleCanvasInteraction({
    activeTool,
    isPanning,
    setIsPanning,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
    activeConnection,
    canvasRef,
    position,
    zoom,
    setActiveConnection
  });

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const nodeType = e.dataTransfer.getData('nodeType');
    
    if (nodeType === 'postit') {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - position.x) / zoom;
      const y = (e.clientY - rect.top - position.y) / zoom;
      
      onAddNode({
        title: 'New Note',
        description: '',
        visualStyle: 'postit',
        x,
        y,
        nodeType: 'generic'
      });
    }
  };

  const transformStyle = {
    transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
    transformOrigin: '0 0',
    transition: isPanning ? 'none' : 'transform 0.1s ease-out',
    touchAction: 'none'
  };

  return (
    <div 
      className="w-full h-screen overflow-hidden cursor-auto relative"
      ref={canvasRef}
      tabIndex={0}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <CanvasBackground zoom={zoom} position={position} />
      
      <div 
        ref={contentRef}
        className="absolute inset-0 will-change-transform" 
        style={transformStyle}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
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
          />
        )}

        {nodes.map(node => (
          <TwoDNode
            key={node.id}
            node={node}
            zoom={zoom}
            onNodeUpdate={(id, updates) => {
              // Adjust position based on zoom and pan
              if (updates.x !== undefined || updates.y !== undefined) {
                const adjustedUpdates = {
                  ...updates,
                  x: updates.x !== undefined ? updates.x : node.x,
                  y: updates.y !== undefined ? updates.y : node.y
                };
                onUpdateNode(id, adjustedUpdates);
              } else {
                onUpdateNode(id, updates);
              }
            }}
            onFocus={onNodeFocus}
            isFocused={focusedNodeId === node.id}
            onDelete={() => onDeleteNode(node.id)}
            isDraggable={activeTool !== 'pan'}
            position={{ x: node.x, y: node.y }}
          />
        ))}
      </div>

      <CanvasControls 
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        zoom={zoom}
        handleZoom={handleZoom}
      />
    </div>
  );
};

export default CanvasView;