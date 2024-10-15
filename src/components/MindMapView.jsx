import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, Sparkles } from 'lucide-react';
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
      isAIInput: type === 'ai',
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

  const handleToggleAINode = (nodeId) => {
    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.id === nodeId ? { ...node, isAIInput: !node.isAIInput } : node
      )
    );
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
        onToggleAINode={handleToggleAINode}
      />
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