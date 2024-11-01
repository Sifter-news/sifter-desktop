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
  const [isPanning, setIsPanning] = useState(false);
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
    if (activeTool === 'pan') {
      setIsPanning(true);
      handlePanStart?.();
      e.preventDefault();
    }
  }, [activeTool, handlePanStart]);

  const handleMouseMove = useCallback((e) => {
    if (isPanning) {
      handlePanMove?.({
        movementX: e.movementX,
        movementY: e.movementY
      });
    }
  }, [isPanning, handlePanMove]);

  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      handlePanEnd?.();
    }
  }, [isPanning, handlePanEnd]);

  const handleDelete = async (nodeId) => {
    try {
      await onNodeDelete(nodeId);
      setShowDeleteConfirmation(false);
      setNodeToDelete(null);
      toast.success("Node deleted successfully");
    } catch (error) {
      console.error('Error deleting node:', error);
      toast.error("Failed to delete node");
    }
  };

  const transformStyle = {
    transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
    transformOrigin: '0 0',
  };

  return (
    <>
      <div 
        className="w-full h-full bg-[#594BFF] overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        ref={ref}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        style={{ cursor: isPanning ? 'grabbing' : 'default' }}
      >
        <CanvasBackground zoom={zoom} position={position} />
        
        <div className="relative" style={transformStyle}>
          {nodes.map(node => (
            <TwoDNode
              key={node.id}
              node={node}
              zoom={zoom}
              onNodeUpdate={onNodeUpdate}
              onFocus={onNodeFocus}
              isFocused={focusedNodeId === node.id}
              onDelete={() => handleDelete(node.id)}
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
        onNodeDelete={handleDelete}
      />
    </>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;
