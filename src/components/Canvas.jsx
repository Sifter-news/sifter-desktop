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
  const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState(null);

  const handleMouseDown = useCallback((e) => {
    if (activeTool === 'pan' || e.button === 1) {
      setIsPanning(true);
      setStartPanPosition({ x: e.clientX, y: e.clientY });
      handlePanStart();
      e.preventDefault();
    }
  }, [activeTool, handlePanStart]);

  const handleMouseMove = useCallback((e) => {
    if (isPanning) {
      const dx = e.clientX - startPanPosition.x;
      const dy = e.clientY - startPanPosition.y;
      handlePanMove({ movementX: dx, movementY: dy });
      setStartPanPosition({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, startPanPosition, handlePanMove]);

  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      handlePanEnd();
    }
    if (draggedNode) {
      setDraggedNode(null);
    }
  }, [isPanning, handlePanEnd, draggedNode]);

  const handleNodeDragStart = useCallback((nodeId) => {
    if (activeTool === 'select') {
      setDraggedNode(nodeId);
    }
  }, [activeTool]);

  const handleNodeDrag = useCallback((e, nodeId) => {
    if (activeTool === 'select' && draggedNode === nodeId) {
      const canvasRect = ref.current.getBoundingClientRect();
      const x = (e.clientX - canvasRect.left) / zoom - position.x;
      const y = (e.clientY - canvasRect.top) / zoom - position.y;

      setNodes(prevNodes => prevNodes.map(node => 
        node.id === nodeId ? { ...node, x, y } : node
      ));
    }
  }, [activeTool, draggedNode, zoom, position, setNodes, ref]);

  const handleNodeDragEnd = useCallback((nodeId) => {
    if (draggedNode === nodeId) {
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        onNodePositionUpdate(nodeId, node.x, node.y);
      }
      setDraggedNode(null);
    }
  }, [draggedNode, nodes, onNodePositionUpdate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (focusedNodeId) {
        if (e.key === 'Delete') {
          const nodeToDelete = nodes.find(node => node.id === focusedNodeId);
          if (nodeToDelete?.type === 'ai') {
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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedNodeId, nodes, onNodeDelete, setNodes]);

  return (
    <>
      <div 
        className={`w-full h-full bg-[#594BFF] overflow-hidden ${isPanning ? 'cursor-grabbing' : activeTool === 'pan' ? 'cursor-grab' : 'cursor-default'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
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
              onDragStart={() => handleNodeDragStart(node.id)}
              onDrag={(e) => handleNodeDrag(e, node.id)}
              onDragEnd={() => handleNodeDragEnd(node.id)}
              zoom={zoom}
              onNodeUpdate={onNodeUpdate}
              onFocus={onNodeFocus}
              isFocused={focusedNodeId === node.id}
              onDelete={onNodeDelete}
              onAIConversation={onAIConversation}
              isDragging={draggedNode === node.id}
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