import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDebug } from '@/contexts/DebugContext';
import CanvasBackground from './canvas/CanvasBackground';
import CanvasControls from './canvas/CanvasControls';
import CanvasContainer from './canvas/CanvasContainer';
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
  setPosition
}, ref) => {
  const [isPanning, setIsPanning] = useState(false);
  const { setDebugData } = useDebug();

  const handleKeyDown = useCallback((e) => {
    if (focusedNodeId && (e.key === 'Delete' || e.key === 'Backspace')) {
      onNodeDelete(focusedNodeId);
      toast.success("Node deleted");
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
    return () => window.removeEventListener('keydown', handleKeyDown);
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
  }, [isPanning, handlePanMove, zoom]);

  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      handlePanEnd?.();
    }
  }, [isPanning, handlePanEnd]);

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
      
      <CanvasContainer zoom={zoom} position={position}>
        {nodes.map(node => (
          <DraggableNode
            key={node.id}
            node={node}
            zoom={zoom}
            position={position}
            onNodeUpdate={onNodeUpdate}
            onFocus={onNodeFocus}
            isFocused={focusedNodeId === node.id}
            activeTool={activeTool}
            allNodes={nodes}
          />
        ))}
      </CanvasContainer>

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