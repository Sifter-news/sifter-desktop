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

  const handleKeyDown = useCallback((e) => {
    if (focusedNodeId && (e.key === 'Delete' || e.key === 'Backspace')) {
      const nodeToDelete = nodes.find(node => node.id === focusedNodeId);
      if (nodeToDelete) {
        if (nodeToDelete.type === 'ai') {
          setNodeToDelete(nodeToDelete);
          setShowDeleteConfirmation(true);
        } else {
          onNodeDelete(focusedNodeId);
          toast.success("Node deleted");
        }
      }
    } else if (focusedNodeId && (e.metaKey || e.ctrlKey) && e.key === 'c') {
      const nodeToCopy = nodes.find(node => node.id === focusedNodeId);
      if (nodeToCopy) {
        copyNode(nodeToCopy);
        toast.success("Node copied to clipboard");
      }
    } else if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
      const newNode = pasteNode();
      if (newNode) {
        setNodes(prev => [...prev, newNode]);
        toast.success("Node pasted from clipboard");
      }
    }
  }, [focusedNodeId, nodes, onNodeDelete, setNodes]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleMouseDown = useCallback((e) => {
    if (e.button === 1 || activeTool === 'pan') {
      setIsPanning(true);
      handlePanStart?.();
      e.preventDefault();
    }
  }, [activeTool, handlePanStart]);

  const handleMouseMove = useCallback((e) => {
    if (isPanning) {
      handlePanMove?.({
        movementX: e.movementX / zoom,
        movementY: e.movementY / zoom
      });
    }
    
    if (activeConnection) {
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - position.x) / zoom;
      const y = (e.clientY - rect.top - position.y) / zoom;
      setActiveConnection(prev => ({
        ...prev,
        endX: x,
        endY: y
      }));
    }
  }, [isPanning, handlePanMove, zoom, activeConnection, position.x, position.y, ref]);

  const handleMouseUp = useCallback((e) => {
    if (isPanning) {
      setIsPanning(false);
      handlePanEnd?.();
    }

    if (activeConnection) {
      // Here you would check if the mouse is over another node's connection point
      // and create a permanent connection if it is
      setActiveConnection(null);
    }
  }, [isPanning, handlePanEnd, activeConnection]);

  const startConnection = (nodeId, startX, startY) => {
    setActiveConnection({
      startX,
      startY,
      endX: startX,
      endY: startY,
      sourceNodeId: nodeId
    });
  };

  const transformStyle = {
    transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
    transformOrigin: '0 0',
  };

  return (
    <div 
      className="w-full h-full overflow-hidden cursor-auto relative"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      ref={ref}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{ cursor: isPanning ? 'grabbing' : activeTool === 'pan' ? 'grab' : 'default' }}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <CanvasBackground zoom={zoom} position={position} />
      
      <div 
        className="absolute inset-0" 
        style={{
          ...transformStyle,
          width: '10000px',  // Make canvas much wider than viewport
          height: '10000px', // Make canvas much taller than viewport
          left: '-5000px',   // Center the canvas
          top: '-5000px'     // Center the canvas
        }}
      >
        {/* Render permanent connections */}
        {connections.map((connection, index) => (
          <ConnectorLine
            key={`connection-${index}`}
            startX={connection.startX}
            startY={connection.startY}
            endX={connection.endX}
            endY={connection.endY}
          />
        ))}

        {/* Render active connection being drawn */}
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
            onNodeUpdate={onNodeUpdate}
            onFocus={onNodeFocus}
            isFocused={focusedNodeId === node.id}
            onDelete={() => onNodeDelete(node.id)}
            isDraggable={activeTool !== 'pan'}
            position={{ x: node.x, y: node.y }}
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