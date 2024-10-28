import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { copyNode, pasteNode } from '@/utils/clipboardUtils';
import { toast } from 'sonner';
import { useKeyboardControls } from './canvas/useKeyboardControls';
import { useSelectionControls } from './canvas/useSelectionControls';
import { useToolInteractions } from './canvas/useToolInteractions';
import SelectionOverlay from './canvas/SelectionOverlay';
import NodeRenderer from './NodeRenderer';

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
  const [draggedNodeId, setDraggedNodeId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const { isSpacePressed } = useKeyboardControls(activeTool, setActiveTool);
  const {
    selectionStart,
    selectionEnd,
    selectedNodes,
    handleSelectionStart,
    handleSelectionMove,
    clearSelection
  } = useSelectionControls(ref, zoom, nodes, onNodeFocus);

  const { handleToolInteraction, resetCursor } = useToolInteractions(
    activeTool,
    isSpacePressed,
    handlePanStart,
    handleSelectionStart
  );

  const handleMouseDown = (e) => {
    handleToolInteraction(e, ref);
  };

  const handleMouseMove = (e) => {
    if (activeTool === 'select' && selectionStart) {
      const rect = ref.current.getBoundingClientRect();
      handleSelectionMove(e, rect);
    } else if (activeTool === 'pan' || isSpacePressed) {
      handlePanMove(e);
    }
  };

  const handleMouseUp = () => {
    if (draggedNodeId) {
      const node = nodes.find(n => n.id === draggedNodeId);
      if (node) {
        onNodePositionUpdate(draggedNodeId, node.x, node.y);
      }
      setDraggedNodeId(null);
      setDragOffset({ x: 0, y: 0 });
    }
    handlePanEnd();
    clearSelection();
    resetCursor();
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

  return (
    <>
      <div 
        className={`w-full h-full bg-[#594BFF] overflow-hidden ${
          isSpacePressed ? 'cursor-grab active:cursor-grabbing' : 
          activeTool === 'pan' ? 'cursor-grab' : 'cursor-default'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        ref={ref}
        tabIndex={0}
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
              isFocused={focusedNodeId === node.id || selectedNodes.includes(node.id)}
              onDelete={onNodeDelete}
              onAIConversation={onAIConversation}
              isDragging={draggedNodeId === node.id}
            />
          ))}
          <SelectionOverlay selectionStart={selectionStart} selectionEnd={selectionEnd} />
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
