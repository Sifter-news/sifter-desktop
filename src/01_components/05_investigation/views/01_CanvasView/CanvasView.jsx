import React from 'react';
import Canvas from '@/components/Canvas';
import { useZoomPan } from '@/hooks/useZoomPan';

const CanvasView = ({ 
  project, 
  nodes, 
  setNodes, 
  onAddNode, 
  onUpdateNode, 
  onDeleteNode,
  focusedNodeId,
  onNodeFocus,
  activeTool,
  setActiveTool
}) => {
  const {
    zoom,
    position,
    handleZoom,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
    handleWheel
  } = useZoomPan(1);

  const handleNodePositionUpdate = (nodeId, position) => {
    onUpdateNode(nodeId, {
      x: position.x,
      y: position.y
    });
  };

  return (
    <div className="flex h-full bg-black">
      <div className="flex-1 relative">
        <div className="absolute inset-0">
          <Canvas
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
            onNodeUpdate={onUpdateNode}
            focusedNodeId={focusedNodeId}
            onNodeFocus={onNodeFocus}
            onNodeDelete={onDeleteNode}
            onNodePositionUpdate={handleNodePositionUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default CanvasView;