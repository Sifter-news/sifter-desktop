import React, { forwardRef, useCallback } from 'react';
import NodeRenderer from './NodeRenderer';

const Canvas = forwardRef(({ 
  nodes, 
  setNodes, 
  zoom, 
  position, 
  activeTool, 
  handlePanStart, 
  handlePanMove, 
  handlePanEnd,
  onNodeUpdate,
  focusedNodeId,
  onNodeFocus
}, ref) => {
  const handleDragStart = useCallback((e, nodeId) => {
    if (activeTool === 'select') {
      setNodes(prevNodes => prevNodes.map(node => 
        node.id === nodeId ? { ...node, isDragging: true } : node
      ));
    }
  }, [activeTool, setNodes]);

  const snapToGrid = useCallback((value) => {
    return Math.round(value / 24) * 24;
  }, []);

  const handleDrag = useCallback((e) => {
    if (activeTool === 'select') {
      setNodes(prevNodes => prevNodes.map(node => 
        node.isDragging ? { 
          ...node, 
          x: snapToGrid((e.clientX - ref.current.offsetLeft) / zoom - position.x), 
          y: snapToGrid((e.clientY - ref.current.offsetTop) / zoom - position.y)
        } : node
      ));
    }
  }, [activeTool, zoom, position.x, position.y, setNodes, snapToGrid, ref]);

  const handleDragEnd = useCallback(() => {
    setNodes(prevNodes => prevNodes.map(node => ({ ...node, isDragging: false })));
  }, [setNodes]);

  const handleCanvasMouseDown = useCallback((e) => {
    if (activeTool === 'pan') {
      handlePanStart();
    }
  }, [activeTool, handlePanStart]);

  const handleCanvasMouseMove = useCallback((e) => {
    handleDrag(e);
    if (activeTool === 'pan') {
      handlePanMove(e);
    }
  }, [activeTool, handleDrag, handlePanMove]);

  const handleCanvasMouseUp = useCallback(() => {
    handleDragEnd();
    if (activeTool === 'pan') {
      handlePanEnd();
    }
  }, [activeTool, handleDragEnd, handlePanEnd]);

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
            radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px, 24px 24px, 24px 24px',
          backgroundPosition: '0 0, 12px 12px, 12px 12px',
          transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
        }}
      >
        {nodes.map(node => (
          <NodeRenderer
            key={node.id}
            node={node}
            onDragStart={handleDragStart}
            zoom={zoom}
            onNodeUpdate={onNodeUpdate}
            onFocus={onNodeFocus}
            isFocused={focusedNodeId === node.id}
          />
        ))}
      </div>
    </div>
  );
});

export default Canvas;