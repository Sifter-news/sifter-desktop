import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDebug } from '@/contexts/DebugContext';
import CanvasBackground from './canvas/CanvasBackground';
import CanvasControls from './canvas/CanvasControls';
import ConnectorLine from './node/ConnectorLine';
import DraggableNode from './canvas/DraggableNode';
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
    } else if (e.key === 'v') {
      setActiveTool('select');
    } else if (e.key === 'h') {
      setActiveTool('pan');
    }
  }, [focusedNodeId, nodes, onNodeDelete, setNodes, setActiveTool]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleMouseDown = useCallback((e) => {
    if (e.button === 1 || activeTool === 'pan') {
      setIsPanning(true);
      handlePanStart?.(e);
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

  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      handlePanEnd?.();
    }

    if (activeConnection) {
      setActiveConnection(null);
    }
  }, [isPanning, handlePanEnd]);

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
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{ cursor: isPanning ? 'grabbing' : activeTool === 'pan' ? 'grab' : 'default' }}
      data-canvas="true"
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
          <DraggableNode
            key={node.id}
            node={node}
            zoom={zoom}
            position={position}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            onNodeUpdate={onNodeUpdate}
            onFocus={onNodeFocus}
            isFocused={focusedNodeId === node.id}
            onDelete={onNodeDelete}
            isDraggable={true}
            activeTool={activeTool}
          />
        ))}
      </div>

      <CanvasControls 
        zoom={zoom}
        handleZoom={handleZoom}
        setPosition={setPosition}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
      />
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;