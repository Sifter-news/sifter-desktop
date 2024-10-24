import React, { useState, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";
import Canvas from '../../components/Canvas';
import { useZoomPan } from '../../utils/canvasUtils';
import { findAvailablePosition } from '../../utils/nodeUtils';

const MindView = ({ project, nodes, setNodes, onAddNode, onUpdateNode, onDeleteNode }) => {
  const { toast } = useToast();
  const canvasRef = useRef(null);
  const [focusedNodeId, setFocusedNodeId] = useState(null);
  const [activeTool, setActiveTool] = useState('select');
  
  const {
    zoom,
    position,
    isPanning,
    handleZoom,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
  } = useZoomPan(1);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const nodeType = e.dataTransfer.getData('nodeType');
    if (!nodeType) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - canvasRect.left) / zoom - position.x;
    const y = (e.clientY - canvasRect.top) / zoom - position.y;

    const newNode = {
      id: Date.now().toString(),
      type: nodeType,
      title: `New ${nodeType} Node`,
      content: '',
      x,
      y,
      width: 200,
      height: 200,
    };

    onAddNode(newNode);
    toast({
      title: "Node Added",
      description: `New ${nodeType} node has been created`,
    });
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div 
        ref={canvasRef}
        className="absolute inset-0 bg-[#594BFF]"
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
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Canvas
          nodes={nodes}
          setNodes={setNodes}
          zoom={zoom}
          position={position}
          activeTool={activeTool}
          handlePanStart={handlePanStart}
          handlePanMove={handlePanMove}
          handlePanEnd={handlePanEnd}
          onNodeUpdate={onUpdateNode}
          focusedNodeId={focusedNodeId}
          onNodeFocus={setFocusedNodeId}
          onNodeDelete={onDeleteNode}
        />
      </div>
    </div>
  );
};

export default MindView;