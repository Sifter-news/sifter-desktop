import React, { forwardRef } from 'react';
import NodeRenderer from './NodeRenderer';

const Canvas = forwardRef(({ 
  nodes, 
  setNodes, 
  zoom, 
  position, 
  activeTool, 
  handlePanStart, 
  handlePanMove, 
  handlePanEnd 
}, ref) => {
  const handleDragStart = (e, nodeId) => {
    if (activeTool === 'select') {
      setNodes(prevNodes => prevNodes.map(node => 
        node.id === nodeId ? { ...node, isDragging: true } : node
      ));
    }
  };

  const handleDrag = (e) => {
    if (activeTool === 'select') {
      setNodes(prevNodes => prevNodes.map(node => 
        node.isDragging ? { 
          ...node, 
          x: (e.clientX - ref.current.offsetLeft) / zoom - position.x, 
          y: (e.clientY - ref.current.offsetTop) / zoom - position.y 
        } : node
      ));
    }
  };

  const handleDragEnd = () => {
    setNodes(prevNodes => prevNodes.map(node => ({ ...node, isDragging: false })));
  };

  const handleCanvasMouseDown = (e) => {
    if (activeTool === 'pan') {
      handlePanStart();
    }
  };

  const handleCanvasMouseMove = (e) => {
    handleDrag(e);
    if (activeTool === 'pan') {
      handlePanMove(e);
    }
  };

  const handleCanvasMouseUp = () => {
    handleDragEnd();
    if (activeTool === 'pan') {
      handlePanEnd();
    }
  };

  return (
    <div 
      className="w-screen h-full bg-[#594BFF] overflow-hidden"
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      ref={ref}
    >
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
          transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
        }}
      >
        {nodes.map(node => (
          <NodeRenderer
            key={node.id}
            node={node}
            onDragStart={handleDragStart}
            zoom={zoom}
          />
        ))}
      </div>
    </div>
  );
});

export default Canvas;