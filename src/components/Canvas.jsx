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
  const [draggedNodeId, setDraggedNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e) => {
    // Only start panning if left click or middle click
    if (e.button === 0 || e.button === 1) {
      setIsPanning(true);
      setStartPanPosition({ x: e.clientX, y: e.clientY });
      handlePanStart();
      e.preventDefault();
    }
  }, [handlePanStart]);

  const handleMouseMove = useCallback((e) => {
    if (isPanning) {
      handlePanMove({ movementX: e.movementX, movementY: e.movementY });
    }
  }, [isPanning, handlePanMove]);

  const handleMouseUp = useCallback(() => {
    if (isPanning) {
      setIsPanning(false);
      handlePanEnd();
    }
    if (draggedNodeId) {
      const node = nodes.find(n => n.id === draggedNodeId);
      if (node) {
        onNodePositionUpdate(draggedNodeId, node.x, node.y);
      }
      setDraggedNodeId(null);
      setDragOffset({ x: 0, y: 0 });
    }
  }, [isPanning, handlePanEnd, draggedNodeId, nodes, onNodePositionUpdate]);

  const handleNodeDragStart = useCallback((e, nodeId) => {
    if (activeTool === 'select') {
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        const rect = ref.current.getBoundingClientRect();
        setDragOffset({
          x: (e.clientX - rect.left) / zoom - node.x - position.x,
          y: (e.clientY - rect.top) / zoom - node.y - position.y
        });
        setDraggedNodeId(nodeId);
      }
    }
  }, [activeTool, nodes, zoom, position]);

  const handleNodeDrag = useCallback((e, nodeId) => {
    if (activeTool === 'select' && draggedNodeId === nodeId) {
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / zoom - dragOffset.x - position.x;
      const y = (e.clientY - rect.top) / zoom - dragOffset.y - position.y;

      setNodes(prevNodes => prevNodes.map(node => 
        node.id === nodeId ? { ...node, x, y } : node
      ));
    }
  }, [activeTool, draggedNodeId, zoom, position, dragOffset, setNodes]);

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
        className={`w-full h-full bg-[#594BFF] overflow-hidden ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
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
              onDragStart={(e) => handleNodeDragStart(e, node.id)}
              onDrag={(e) => handleNodeDrag(e, node.id)}
              onDragEnd={() => handleMouseUp()}
              zoom={zoom}
              onNodeUpdate={onNodeUpdate}
              onFocus={onNodeFocus}
              isFocused={focusedNodeId === node.id}
              onDelete={onNodeDelete}
              onAIConversation={onAIConversation}
              isDragging={draggedNodeId === node.id}
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