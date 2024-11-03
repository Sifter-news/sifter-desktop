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
      // Adjust for canvas center offset and zoom
      const x = ((e.clientX - rect.left - position.x) / zoom) + (rect.width / (2 * zoom));
      const y = ((e.clientY - rect.top - position.y) / zoom) + (rect.height / (2 * zoom));
      
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