import React, { useState, useRef, useEffect } from 'react';
import { saveInvestigationState, loadInvestigationState } from '../../utils/projectUtils';
import { useZoomPan, findAvailablePosition } from '../../utils/canvasUtils';
import Canvas from '../../components/Canvas';
import NodeComponent from '../../components/NodeComponent';
import { Button } from "@/components/ui/button";
import { PlusIcon } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const MindView = ({ project, nodes, setNodes, onAddNode, onUpdateNode, onDeleteNode }) => {
  const canvasRef = useRef(null);
  const { toast } = useToast();
  const [selectedNode, setSelectedNode] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const { 
    zoom: transform,
    position,
    handleZoom: handleWheel,
    handlePanStart: handleMouseDown,
    handlePanMove: handleMouseMove,
    handlePanEnd: handleMouseUp
  } = useZoomPan();

  useEffect(() => {
    const savedNodes = loadInvestigationState(project.id);
    if (savedNodes && savedNodes.length > 0) {
      setNodes(savedNodes);
    }
  }, [project.id, setNodes]);

  useEffect(() => {
    saveInvestigationState(project.id, nodes);
  }, [project.id, nodes]);

  const handleNodeMouseDown = (e, node) => {
    e.stopPropagation();
    setSelectedNode(node);
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleCanvasMouseMove = (e) => {
    if (isDragging && selectedNode) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - canvasRect.left - dragOffset.x) / transform.scale;
      const y = (e.clientY - canvasRect.top - dragOffset.y) / transform.scale;
      
      onUpdateNode(selectedNode.id, { x, y });
    } else {
      handleMouseMove(e);
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
    setSelectedNode(null);
    handleMouseUp();
  };

  const handleAddNode = (type) => {
    const position = findAvailablePosition(nodes);
    const newNode = {
      id: Date.now().toString(),
      type: type || 'basic',
      title: 'New Node',
      description: '',
      x: position.x,
      y: position.y
    };
    
    onAddNode(newNode);
    toast({
      title: "Node Added",
      description: `New ${type || 'basic'} node has been created`,
    });
  };

  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-100">
      <div className="absolute top-4 left-4 z-10 flex space-x-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => handleAddNode('basic')}
        >
          <PlusIcon className="w-4 h-4 mr-1" />
          Add Node
        </Button>
      </div>
      
      <Canvas
        ref={canvasRef}
        transform={transform}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
      >
        {nodes.map((node) => (
          <NodeComponent
            key={node.id}
            node={node}
            transform={transform}
            onMouseDown={(e) => handleNodeMouseDown(e, node)}
            onUpdate={(updates) => onUpdateNode(node.id, updates)}
            onDelete={() => onDeleteNode(node.id)}
          />
        ))}
      </Canvas>
    </div>
  );
};

export default MindView;