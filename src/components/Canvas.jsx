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
  const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 });
  const [draggedNodeId, setDraggedNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleDrop = (e) => {
    e.preventDefault();
    const nodeType = e.dataTransfer.getData('nodeType');
    if (nodeType) {
      const rect = ref.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - position.x) / zoom;
      const y = (e.clientY - rect.top - position.y) / zoom;
      
      const newNode = {
        id: Date.now().toString(),
        type: nodeType,
        nodeType: nodeType, // Set the node type from the dragged item
        visualStyle: nodeType === 'postit' ? 'postit' : 'default',
        title: 'New Node',
        description: '',
        x,
        y,
        width: 200,
        height: nodeType === 'postit' ? 200 : 100,
        color: '#000000',
        backgroundColor: nodeType === 'postit' ? '#FFF8DC' : '#FFFFFF',
      };
      
      onAddNode(newNode);
    }
  };

  const handleKeyDown = useCallback((e) => {
    if (focusedNodeId && (e.key === 'Delete' || e.key === 'Backspace')) {
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
  }, [focusedNodeId, nodes, onNodeDelete, setNodes]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleMouseDown = useCallback((e) => {
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

  return (
    <>
      <div 
        className={`w-full h-full bg-[#594BFF] overflow-hidden ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        ref={ref}
        tabIndex={0} // Make the div focusable to capture keyboard events
      >
        <div 
          className="absolute inset-0" 
          style={{
            width: '100%',
            height: '100%',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            transformOrigin: '0 0',
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

export default Canvas;

