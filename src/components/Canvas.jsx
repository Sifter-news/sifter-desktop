import React, { forwardRef, useCallback, useEffect } from 'react';
import { useCanvasState } from '@/hooks/useCanvasState';
import CanvasGrid from './canvas/CanvasGrid';
import NodeLayer from './canvas/NodeLayer';
import { toast } from 'sonner';

const Canvas = forwardRef(({ 
  nodes, 
  setNodes, 
  activeTool,
  onNodeUpdate,
  focusedNodeId,
  onNodeFocus,
  onNodeDelete,
  onAIConversation,
  onNodePositionUpdate
}, ref) => {
  const {
    zoom,
    position,
    isDragging,
    handleZoom,
    startDrag,
    updateDrag,
    endDrag
  } = useCanvasState(1);

  const handleWheel = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = -e.deltaY * 0.001;
      handleZoom(delta);
    }
  }, [handleZoom]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        document.body.style.cursor = 'grab';
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        document.body.style.cursor = 'default';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div 
      className="w-full h-full bg-[#594BFF] overflow-hidden cursor-default relative"
      onWheel={handleWheel}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) startDrag(e.clientX, e.clientY);
      }}
      onMouseMove={(e) => updateDrag(e.clientX, e.clientY)}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      ref={ref}
      tabIndex={0}
    >
      <div 
        className="absolute inset-0 transition-transform"
        style={{
          transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
          transformOrigin: '50% 50%'
        }}
      >
        <CanvasGrid zoom={zoom} position={position} />
        <NodeLayer
          nodes={nodes}
          zoom={zoom}
          onNodeUpdate={onNodeUpdate}
          focusedNodeId={focusedNodeId}
          onNodeFocus={onNodeFocus}
          onNodeDelete={onNodeDelete}
          onAIConversation={onAIConversation}
          onNodePositionUpdate={onNodePositionUpdate}
        />
      </div>
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;