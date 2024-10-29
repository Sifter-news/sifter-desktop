import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import NodeRenderer from './NodeRenderer';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { copyNode, pasteNode } from '@/utils/clipboardUtils';
import { toast } from 'sonner';
import { useDebug } from '@/contexts/DebugContext';

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
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const [clickCount, setClickCount] = useState(0);
  const [clickTimeout, setClickTimeout] = useState(null);
  const { setDebugData } = useDebug();

  const updateDebugInfo = useCallback((action) => {
    setDebugData(prev => ({
      ...prev,
      mouseInteractions: {
        currentTool: activeTool,
        action,
        clickType: clickCount === 1 ? 'Single Click' : 'Double Click',
        isPanning,
        position: lastMousePosition
      }
    }));
  }, [activeTool, clickCount, isPanning, lastMousePosition, setDebugData]);

  const handleKeyDown = useCallback((e) => {
    if (e.code === 'Space' && !e.repeat && !isSpacePressed) {
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
  }, [focusedNodeId, nodes, onNodeDelete, setNodes, isSpacePressed, activeTool, setActiveTool]);

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
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        ref={ref}
        tabIndex={0}
        style={{ cursor: isPanning ? 'grabbing' : 'default' }}
      >
        <div 
          className="absolute inset-0" 
          style={{
            width: '100%',
            height: '100%',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '120px 120px',
            transformOrigin: '0 0',
            transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
          }}
        >
          {nodes.map(node => (
            <NodeRenderer
              key={node.id}
              node={node}
              zoom={zoom}
              onNodeUpdate={onNodeUpdate}
              onFocus={onNodeFocus}
              isFocused={focusedNodeId === node.id}
              onDelete={onNodeDelete}
              onAIConversation={onAIConversation}
              onNodePositionUpdate={onNodePositionUpdate}
              isDraggable={activeTool !== 'pan'}
              allNodes={nodes}
              className={focusedNodeId === node.id ? 'ring-2 ring-blue-500 ring-offset-2 transition-all duration-200' : ''}
            />
          ))}
        </div>
      </div>

      <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this AI node?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the AI node and its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirmation(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              if (nodeToDelete) {
                onNodeDelete(nodeToDelete.id);
                toast.success("AI node deleted");
              }
              setShowDeleteConfirmation(false);
              setNodeToDelete(null);
            }}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;