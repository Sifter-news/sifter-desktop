import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import Canvas from './Canvas';
import { useZoomPan } from '@/hooks/useZoomPan';

const Canvas2DView = ({ 
  nodes, 
  setNodes, 
  onAddNode, 
  onUpdateNode, 
  onDeleteNode,
  focusedNodeId,
  onNodeFocus 
}) => {
  const [activeTool, setActiveTool] = useState('select');
  const canvasRef = useRef(null);
  const {
    zoom,
    position,
    handleZoom,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
    handleWheel
  } = useZoomPan(1);

  const handleNodeUpdate = async (nodeId, updates) => {
    try {
      await onUpdateNode(nodeId, updates);
      toast.success('Node updated successfully');
    } catch (error) {
      toast.error('Failed to update node');
    }
  };

  const handleNodePositionUpdate = (nodeId, position) => {
    handleNodeUpdate(nodeId, {
      x: position.x,
      y: position.y
    });
  };

  return (
    <div className="h-full w-full relative bg-[#594BFF]">
      <Canvas
        ref={canvasRef}
        nodes={nodes}
        setNodes={setNodes}
        zoom={zoom}
        position={position}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        handlePanStart={handlePanStart}
        handlePanMove={handlePanMove}
        handlePanEnd={handlePanEnd}
        handleWheel={handleWheel}
        onNodeUpdate={handleNodeUpdate}
        focusedNodeId={focusedNodeId}
        onNodeFocus={onNodeFocus}
        onNodeDelete={onDeleteNode}
        onNodePositionUpdate={handleNodePositionUpdate}
      />
    </div>
  );
};

export default Canvas2DView;