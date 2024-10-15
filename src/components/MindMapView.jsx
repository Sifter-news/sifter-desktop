import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from 'lucide-react';
import { saveProjectState, loadProjectState } from '../utils/projectUtils';
import { useZoomPan } from '../utils/canvasUtils';
import Canvas from './Canvas';
import Toolbar from './Toolbar';

const MindMapView = ({ project }) => {
  const [showAIInput, setShowAIInput] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [activeTool, setActiveTool] = useState('select');
  const [focusedNodeId, setFocusedNodeId] = useState(null);
  const canvasRef = useRef(null);

  const {
    zoom,
    position,
    handleZoom,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
  } = useZoomPan();

  useEffect(() => {
    const savedNodes = loadProjectState(project.id);
    if (savedNodes.length > 0) {
      setNodes(savedNodes);
    }
  }, [project.id]);

  useEffect(() => {
    saveProjectState(project.id, nodes);
  }, [project.id, nodes]);

  const handleAIClick = () => {
    setShowAIInput(!showAIInput);
  };

  const handleAddNode = (type) => {
    const newNode = {
      id: Date.now(),
      type,
      x: Math.random() * (window.innerWidth - 100),
      y: Math.random() * (window.innerHeight - 200),
      text: '',
      source: '',
      connectorStart: type === 'connector' ? { x: 0, y: 0 } : null,
      connectorEnd: type === 'connector' ? { x: 100, y: 100 } : null,
      width: 200,
      height: 200,
    };
    setNodes([...nodes, newNode]);
  };

  const handleNodeUpdate = (nodeId, updates) => {
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === nodeId ? { ...node, ...updates } : node
      )
    );
  };

  const handleNodeFocus = (nodeId) => {
    setFocusedNodeId(nodeId);
  };

  const handleNodeDelete = (nodeId) => {
    setNodes(prevNodes => prevNodes.filter(node => node.id !== nodeId));
    setFocusedNodeId(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] w-screen overflow-hidden">
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
        onNodeUpdate={handleNodeUpdate}
        focusedNodeId={focusedNodeId}
        onNodeFocus={handleNodeFocus}
        onNodeDelete={handleNodeDelete}
      />
      {showAIInput && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-lg p-2 flex items-center space-x-2 max-w-xl w-full">
          <Button size="icon" className="rounded-full flex-shrink-0 bg-[#594BFF1A] hover:bg-[#594BFF33]">
            <PlusIcon className="h-6 w-6 text-[#594BFF]" />
          </Button>
          <Input 
            type="text" 
            placeholder="Ask anything about this project" 
            className="flex-grow text-lg border-none focus:ring-0 rounded-full"
          />
          <Button className="bg-[#594BFF] hover:bg-[#4B3FD9] text-white rounded-full px-6">
            Ask
          </Button>
        </div>
      )}
      <Toolbar
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        handleAIClick={handleAIClick}
        handleAddNode={handleAddNode}
        handleZoom={handleZoom}
        zoom={zoom}
      />
    </div>
  );
};

export default MindMapView;