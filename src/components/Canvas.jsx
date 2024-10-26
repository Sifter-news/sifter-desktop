import React, { useRef, useEffect } from 'react';
import NodeRenderer from './NodeRenderer';
import FocusedNodeTooltip from './FocusedNodeTooltip';

const Canvas = React.forwardRef(({ 
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
  onNodeFocus,
  onNodeDelete,
  onAIConversation,
  onAddNode
}, ref) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!ref) return;

    // Set the ref's current value
    ref.current = canvasRef.current;

    // Cleanup function
    return () => {
      if (ref) {
        ref.current = null;
      }
    };
  }, [ref]);

  const handleDragStart = (e, nodeId) => {
    if (activeTool === 'pan') return;
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;
  };

  return (
    <div
      ref={canvasRef}
      className="w-full h-full relative overflow-hidden bg-gray-50"
      onMouseDown={handlePanStart}
      onMouseMove={handlePanMove}
      onMouseUp={handlePanEnd}
      onMouseLeave={handlePanEnd}
    >
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          transformOrigin: '0 0',
        }}
        className="absolute top-0 left-0"
      >
        {nodes.map((node) => (
          <NodeRenderer
            key={node.id}
            node={node}
            onDragStart={handleDragStart}
            zoom={zoom}
            onNodeUpdate={onNodeUpdate}
            onFocus={onNodeFocus}
            isFocused={focusedNodeId === node.id}
            onAIConversation={onAIConversation}
            onDelete={onNodeDelete}
            onAddNode={onAddNode}
          />
        ))}
      </div>
      {focusedNodeId && (
        <FocusedNodeTooltip
          node={nodes.find(n => n.id === focusedNodeId)}
          onClose={() => onNodeFocus(null)}
        />
      )}
    </div>
  );
});

Canvas.displayName = 'Canvas';

export default Canvas;