import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import NodeRenderer from './NodeRenderer';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

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
  onDrop
}, ref) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = React.useState(false);
  const [nodeToDelete, setNodeToDelete] = React.useState(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 });

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Delete' && focusedNodeId) {
      const nodeToDelete = nodes.find(node => node.id === focusedNodeId);
      if (nodeToDelete?.type === 'ai') {
        setNodeToDelete(nodeToDelete);
        setShowDeleteConfirmation(true);
      } else {
        onNodeDelete(focusedNodeId);
      }
    }
    if (e.code === 'Space' && !isSpacePressed) {
      e.preventDefault();
      setIsSpacePressed(true);
      document.body.style.cursor = 'grab';
    }
  }, [focusedNodeId, nodes, onNodeDelete, isSpacePressed]);

  const handleKeyUp = useCallback((e) => {
    if (e.code === 'Space') {
      setIsSpacePressed(false);
      document.body.style.cursor = 'default';
      setIsPanning(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.body.style.cursor = 'default';
    };
  }, [handleKeyDown, handleKeyUp]);

  const handleDragStart = useCallback((e, nodeId) => {
    if (activeTool === 'select' && !isSpacePressed) {
      setNodes(prevNodes => prevNodes.map(node => 
        node.id === nodeId ? { ...node, isDragging: true } : node
      ));
    }
  }, [activeTool, setNodes, isSpacePressed]);

  const handleMouseDown = useCallback((e) => {
    if (isSpacePressed) {
      setIsPanning(true);
      document.body.style.cursor = 'grabbing';
      setStartPanPosition({ x: e.clientX, y: e.clientY });
    }
  }, [isSpacePressed]);

  const handleMouseMove = useCallback((e) => {
    if (isPanning && isSpacePressed) {
      const deltaX = e.clientX - startPanPosition.x;
      const deltaY = e.clientY - startPanPosition.y;
      handlePanMove({ movementX: deltaX, movementY: deltaY });
      setStartPanPosition({ x: e.clientX, y: e.clientY });
    }
  }, [isPanning, isSpacePressed, startPanPosition, handlePanMove]);

  const handleMouseUp = useCallback(() => {
    if (isSpacePressed) {
      document.body.style.cursor = 'grab';
      setIsPanning(false);
    }
  }, [isSpacePressed]);

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
        className="w-screen h-full bg-[#594BFF] overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
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
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

export default Canvas;
