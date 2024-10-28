import React, { forwardRef, useState } from 'react';
import { useCanvasKeyboard } from '../hooks/useCanvasKeyboard';
import { useCanvasPanning } from '../hooks/useCanvasPanning';
import CanvasGrid from './canvas/CanvasGrid';
import CanvasNodes from './canvas/CanvasNodes';
import DeleteNodeDialog from './canvas/DeleteNodeDialog';

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
  onAIConversation,
  onNodePositionUpdate
}, ref) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [previousTool, setPreviousTool] = useState(null);

  const { handleKeyDown, handleKeyUp } = useCanvasKeyboard({
    focusedNodeId,
    nodes,
    onNodeDelete,
    setNodes,
    isSpacePressed,
    setIsSpacePressed,
    activeTool,
    setActiveTool,
    previousTool,
    setPreviousTool
  });

  const {
    isPanning,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  } = useCanvasPanning({
    isSpacePressed,
    activeTool,
    handlePanStart,
    handlePanMove,
    handlePanEnd
  });

  return (
    <>
      <div 
        className={`w-full h-full bg-[#594BFF] overflow-hidden ${
          isPanning ? 'cursor-grabbing' : 
          isSpacePressed ? 'cursor-grab' : 
          'cursor-default'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        ref={ref}
        tabIndex={0}
      >
        <CanvasGrid zoom={zoom} position={position} />
        <CanvasNodes
          nodes={nodes}
          zoom={zoom}
          onNodeUpdate={onNodeUpdate}
          focusedNodeId={focusedNodeId}
          onNodeFocus={onNodeFocus}
          onNodeDelete={(nodeId) => {
            const nodeToDelete = nodes.find(node => node.id === nodeId);
            if (nodeToDelete?.type === 'ai') {
              setNodeToDelete(nodeToDelete);
              setShowDeleteConfirmation(true);
            } else {
              onNodeDelete(nodeId);
            }
          }}
          onAIConversation={onAIConversation}
          onNodePositionUpdate={onNodePositionUpdate}
          activeTool={activeTool}
        />
      </div>

      <DeleteNodeDialog
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        nodeToDelete={nodeToDelete}
        onDelete={onNodeDelete}
        setNodeToDelete={setNodeToDelete}
      />
    </>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;