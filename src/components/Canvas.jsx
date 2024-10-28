import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { copyNode, pasteNode } from '@/utils/clipboardUtils';
import { toast } from 'sonner';
import { useKeyboardControls } from './canvas/useKeyboardControls';
import { useSelectionControls } from './canvas/useSelectionControls';
import SelectionOverlay from './canvas/SelectionOverlay';
import NodeRenderer from './NodeRenderer';
import PanningControls from './canvas/PanningControls';
import DeleteConfirmationDialog from './canvas/DeleteConfirmationDialog';

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
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const { isSpacePressed } = useKeyboardControls(activeTool, setActiveTool);
  const {
    selectionStart,
    selectionEnd,
    selectedNodes,
    handleSelectionStart,
    handleSelectionMove,
    clearSelection
  } = useSelectionControls(ref, zoom, nodes, onNodeFocus);

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

  const handleMouseDown = (e) => {
    if (e.target === ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setDragStart({
        x: e.clientX,
        y: e.clientY
      });
      
      if (activeTool === 'pan' || isSpacePressed) {
        setIsDragging(true);
        handlePanStart();
      } else if (activeTool === 'select') {
        handleSelectionStart(e, rect);
      }
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && (activeTool === 'pan' || isSpacePressed)) {
      handlePanMove(e);
    } else if (activeTool === 'select' && selectionStart) {
      const rect = ref.current.getBoundingClientRect();
      handleSelectionMove(e, rect);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    handlePanEnd();
    clearSelection();
  };

  const handleWheelZoom = (e) => {
    e.preventDefault();
    handleWheel(e);
  };

  return (
    <>
      <PanningControls
        isDragging={isDragging}
        activeTool={activeTool}
        isSpacePressed={isSpacePressed}
        handlePanStart={handlePanStart}
        handlePanMove={handlePanMove}
        handlePanEnd={handlePanEnd}
        handleMouseDown={handleMouseDown}
        handleMouseMove={handleMouseMove}
        handleMouseUp={handleMouseUp}
        handleWheelZoom={handleWheelZoom}
        ref={ref}
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
              zoom={zoom}
              onNodeUpdate={onNodeUpdate}
              onFocus={onNodeFocus}
              isFocused={focusedNodeId === node.id || selectedNodes.includes(node.id)}
              onDelete={onNodeDelete}
              onAIConversation={onAIConversation}
              isDragging={isDragging}
            />
          ))}
          <SelectionOverlay selectionStart={selectionStart} selectionEnd={selectionEnd} />
        </div>
      </PanningControls>

      <DeleteConfirmationDialog
        showDeleteConfirmation={showDeleteConfirmation}
        setShowDeleteConfirmation={setShowDeleteConfirmation}
        nodeToDelete={nodeToDelete}
        setNodeToDelete={setNodeToDelete}
        onNodeDelete={onNodeDelete}
      />
    </>
  );
});

export default Canvas;