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
      <Canvas
        ref={canvasRef}
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
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />
    </div>
  );
};

export default MindView;