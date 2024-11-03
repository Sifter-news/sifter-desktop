import React, { useRef, useState } from 'react';
import Canvas from '@/components/Canvas';
import { useZoomPan } from '@/hooks/useZoomPan';

const CanvasView = ({ 
  nodes, 
  setNodes, 
  onAddNode, 
  onUpdateNode, 
  onDeleteNode,
  focusedNodeId,
  onNodeFocus,
  selectedNodeId 
}) => {
  const canvasRef = useRef(null);
  const [activeTool, setActiveTool] = useState('select');
  const { 
    zoom, 
    position, 
    handleZoom, 
    handlePanStart, 
    handlePanMove, 
    handlePanEnd, 
    handleWheel,
    setPosition 
  } = useZoomPan();

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const nodeType = e.dataTransfer.getData('nodeType');
    
    if (nodeType === 'postit') {
      const rect = canvasRef.current.getBoundingClientRect();
      // Calculate position relative to the current view center
      const viewCenterX = -position.x / zoom;
      const viewCenterY = -position.y / zoom;
      
      // Add the relative mouse position from the view center
      const x = viewCenterX + ((e.clientX - rect.left) / zoom);
      const y = viewCenterY + ((e.clientY - rect.top) / zoom);
      
      onAddNode({
        title: 'New Note',
        description: '',
        visualStyle: 'postit',
        x,
        y,
        nodeType: 'generic'
      });
    }
  };

  return (
    <div className="w-full h-full">
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
        handleZoom={handleZoom}
        onNodeUpdate={onUpdateNode}
        focusedNodeId={focusedNodeId}
        onNodeFocus={onNodeFocus}
        onNodeDelete={onDeleteNode}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        selectedNodeId={selectedNodeId}
        setPosition={setPosition}
      />
    </div>
  );
};

export default CanvasView;