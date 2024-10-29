import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useDebug } from '@/contexts/DebugContext';
import TwoDNode from './node/TwoDNode';
import CanvasBackground from './canvas/CanvasBackground';
import CanvasControls from './canvas/CanvasControls';
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
  onNodeUpdate,
  focusedNodeId,
  onNodeFocus,
  onNodeDelete,
  onDragOver,
  onDrop,
  onAIConversation,
  onNodePositionUpdate
}, ref) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [previousTool, setPreviousTool] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const { setDebugData } = useDebug();

  const handleKeyDown = useCallback((e) => {
    if (e.code === 'Space' && !e.repeat && !isSpacePressed && isHovered) {
      e.preventDefault();
      setIsSpacePressed(true);
      setPreviousTool(activeTool);
      setActiveTool('pan');
    } else if (focusedNodeId && (e.key === 'Delete' || e.key === 'Backspace')) {
      const nodeToDelete = nodes.find(node => node.id === focusedNodeId);
      if (nodeToDelete?.type === 'ai') {
        setNodeToDelete(nodeToDelete);
        setShowDeleteConfirmation(true);
      } else {
        onNodeDelete(focusedNodeId);
        toast.success("Node deleted");
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
  }, [focusedNodeId, nodes, onNodeDelete, setNodes, isSpacePressed, activeTool, setActiveTool, isHovered]);

  const handleKeyUp = useCallback((e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      setIsSpacePressed(false);
      setActiveTool(previousTool || 'select');
    }
  }, [previousTool, setActiveTool]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const handleMouseDown = useCallback((e) => {
    if (isSpacePressed || activeTool === 'pan') {
      setClickCount(prev => prev + 1);
      
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
      
      const newTimeout = setTimeout(() => {
        setClickCount(0);
      }, 300);
      
      setClickTimeout(newTimeout);
      
      setIsPanning(true);
      setLastMousePosition({ x: e.clientX, y: e.clientY });
      handlePanStart?.();
      updateDebugInfo('Pan Start');
      e.preventDefault();
    }
  }, [isSpacePressed, activeTool, handlePanStart, clickTimeout, updateDebugInfo]);

  const handleMouseMove = useCallback((e) => {
    if (isPanning) {
      const dx = e.clientX - lastMousePosition.x;
      const dy = e.clientY - lastMousePosition.y;
      
      handlePanMove?.({
        movementX: dx,
        movementY: dy
      });
      
      setLastMousePosition({ x: e.clientX, y: e.clientY });
      updateDebugInfo('Panning');
    }
  }, [isPanning, handlePanMove, lastMousePosition, updateDebugInfo]);

  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      handlePanEnd?.();
      updateDebugInfo('Pan End');
    }
  }, [isPanning, handlePanEnd, updateDebugInfo]);

  return (
    <>
      <div 
        className="w-full h-full bg-[#594BFF] overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          handleMouseUp();
          setIsHovered(false);
        }}
        onMouseEnter={() => setIsHovered(true)}
        onWheel={handleWheel}
        ref={ref}
        tabIndex={0}
        style={{ cursor: isPanning ? 'grabbing' : 'default' }}
      >
        <CanvasBackground zoom={zoom} position={position} />
        
        <div className="relative">
          {nodes.map(node => (
            <TwoDNode
              key={node.id}
              node={node}
              zoom={zoom}
              onNodeUpdate={onNodeUpdate}
              onFocus={onNodeFocus}
              isFocused={focusedNodeId === node.id}
              onDelete={onNodeDelete}
              isDraggable={activeTool !== 'pan'}
              position={{ x: node.x, y: node.y }}
            />
          ))}
        </div>
      </div>

      <CanvasControls 
        showDeleteConfirmation={showDeleteConfirmation}
        setShowDeleteConfirmation={setShowDeleteConfirmation}
        nodeToDelete={nodeToDelete}
        onNodeDelete={onNodeDelete}
      />
    </>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;
