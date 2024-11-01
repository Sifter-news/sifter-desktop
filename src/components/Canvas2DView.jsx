import React, { useState, useRef } from 'react';
import { toast } from 'sonner';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
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
    <div className="absolute inset-0 bg-[#594BFF]">
      <nav className="fixed top-0 left-0 right-0 z-10">
        <Toolbar 
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          handleZoom={handleZoom}
          zoom={zoom}
          viewMode="2d"
          onViewModeChange={() => {}}
          onAddNode={onAddNode}
        />
      </nav>

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