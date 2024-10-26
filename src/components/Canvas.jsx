import React, { forwardRef, useCallback, useEffect } from 'react';
import NodeRenderer from './NodeRenderer';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

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

  const handleDragStart = useCallback((e, nodeId) => {
    if (activeTool === 'select') {
      setNodes(prevNodes => prevNodes.map(node => 
        node.id === nodeId ? { ...node, isDragging: true } : node
      ));
    }
  }, [activeTool, setNodes]);

  const handleDrag = useCallback((e) => {
    if (activeTool === 'select') {
      setNodes(prevNodes => prevNodes.map(node => 
        node.isDragging ? { 
          ...node, 
          x: Math.round((e.clientX - ref.current.offsetLeft) / zoom - position.x), 
          y: Math.round((e.clientY - ref.current.offsetTop) / zoom - position.y)
        } : node
      ));
    }
  }, [activeTool, zoom, position.x, position.y, setNodes, ref]);

  const handleDragEnd = useCallback(() => {
    setNodes(prevNodes => prevNodes.map(node => ({ ...node, isDragging: false })));
  }, [setNodes]);

  const handleNodeDelete = useCallback((nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node.type === 'person' || node.type === 'organization') {
      setNodeToDelete(node);
      setShowDeleteConfirmation(true);
    } else {
      onNodeDelete(nodeId);
      toast.success("Node deleted successfully");
    }
  }, [nodes, onNodeDelete]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && focusedNodeId) {
        handleNodeDelete(focusedNodeId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedNodeId, handleNodeDelete]);

  return (
    <>
      <div 
        className="w-screen h-full bg-[#594BFF] overflow-hidden"
        onMouseDown={handlePanStart}
        onMouseMove={handlePanMove}
        onMouseUp={handlePanEnd}
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
              onDelete={handleNodeDelete}
            />
          ))}
        </div>
      </div>
      <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {nodeToDelete?.type} node?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the node and its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirmation(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              onNodeDelete(nodeToDelete?.id);
              setShowDeleteConfirmation(false);
              setNodeToDelete(null);
              toast.success("Node deleted successfully");
            }}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
});

export default Canvas;