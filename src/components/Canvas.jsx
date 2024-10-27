import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import NodeRenderer from './NodeRenderer';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { copyNode, pasteNode } from '@/utils/clipboardUtils';
import { toast } from 'sonner';

const Canvas = forwardRef(({ 
  nodes, 
  setNodes, 
  zoom, 
  position, 
  activeTool, 
  handlePanStart, 
  handlePanMove, 
  handlePanEnd,
  onNodeUpdate,
  focusedNodeId,
  onNodeFocus,
  onNodeDelete,
  onDragOver,
  onDrop,
  onAIConversation,
  onNodePositionUpdate
}, ref) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);
  const [nodeToDelete, setNodeToDelete] = React.useState(null);
  const [isPanning, setIsPanning] = useState(false);
  const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
  const [isCanvasGrabbed, setIsCanvasGrabbed] = useState(false);

  const handleDragStart = useCallback((e, nodeId) => {
    if (activeTool === 'select') {
      setNodes(prevNodes => prevNodes.map(node => 
        node.id === nodeId ? { ...node, isDragging: true } : node
      ));
    }
  }, [activeTool, setNodes]);

  const handleDrag = useCallback((e) => {
    if (activeTool === 'select') {
      setNodes(prevNodes => prevNodes.map(node => {
        if (node.isDragging) {
          const newX = Math.round((e.clientX - ref.current.offsetLeft) / zoom - position.x);
          const newY = Math.round((e.clientY - ref.current.offsetTop) / zoom - position.y);
          return { 
            ...node, 
            x: newX, 
            y: newY
          };
        }
        return node;
      }));
    }
  }, [activeTool, zoom, position.x, position.y, setNodes, ref]);

  const handleDragEnd = useCallback(() => {
    setNodes(prevNodes => {
      const draggedNode = prevNodes.find(node => node.isDragging);
      if (draggedNode) {
        onNodePositionUpdate(draggedNode.id, draggedNode.x, draggedNode.y);
      }
      return prevNodes.map(node => ({ ...node, isDragging: false }));
    });
  }, [setNodes, onNodePositionUpdate]);

  const handleCanvasClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onNodeFocus(null);
    }
  }, [onNodeFocus]);

  const handleCanvasMouseDown = useCallback((e) => {
    if (e.target === e.currentTarget) {
      setIsCanvasGrabbed(true);
      setLastMousePosition({ x: e.clientX, y: e.clientY });
      document.body.style.cursor = 'grabbing';
    }
  }, []);

  const handleCanvasMouseMove = useCallback((e) => {
    handleDrag(e);
    if (isCanvasGrabbed) {
      const dx = e.clientX - lastMousePosition.x;
      const dy = e.clientY - lastMousePosition.y;
      handlePanMove({ movementX: dx, movementY: dy });
      setLastMousePosition({ x: e.clientX, y: e.clientY });
    }
  }, [handleDrag, isCanvasGrabbed, lastMousePosition, handlePanMove]);

  const handleCanvasMouseUp = useCallback(() => {
    handleDragEnd();
    setIsCanvasGrabbed(false);
    document.body.style.cursor = 'default';
  }, [handleDragEnd]);

  const handleCanvasMouseLeave = useCallback(() => {
    handleDragEnd();
    setIsCanvasGrabbed(false);
    document.body.style.cursor = 'default';
  }, [handleDragEnd]);

  const handleKeyDown = useCallback((e) => {
    if (focusedNodeId) {
      if (e.key === 'Delete') {
        const nodeToDelete = nodes.find(node => node.id === focusedNodeId);
        if (nodeToDelete.type === 'ai') {
          setNodeToDelete(nodeToDelete);
          setShowDeleteConfirmation(true);
        } else {
          onNodeDelete(focusedNodeId);
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
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
    }
  }, [focusedNodeId, nodes, onNodeDelete, setNodes]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleConfirmDelete = () => {
    if (nodeToDelete) {
      onNodeDelete(nodeToDelete.id);
    }
    setShowDeleteConfirmation(false);
    setNodeToDelete(null);
  };

  return (
    <>
      <div 
        className={`w-[1000vw] h-[1000vh] bg-[#594BFF] overflow-hidden ${isCanvasGrabbed ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          position: 'absolute',
          left: '-450vw',  // Center the expanded canvas
          top: '-450vh',   // Center the expanded canvas
        }}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseLeave}
        onClick={handleCanvasClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        ref={ref}
      >
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px),
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '24px 24px, 24px 24px, 24px 24px',
            backgroundPosition: '0 0, 12px 12px, 12px 12px',
            transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
          }}
        >
          {nodes.map(node => (
            <NodeRenderer
              key={node.id}
              node={node}
              onDragStart={handleDragStart}
              zoom={zoom}
              onNodeUpdate={onNodeUpdate}
              onFocus={onNodeFocus}
              isFocused={focusedNodeId === node.id}
              onDelete={onNodeDelete}
              onAIConversation={onAIConversation}
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

export default Canvas;