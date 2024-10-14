import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, Hand, Sparkles, Square, StickyNote, Type, Link, Layers, ToggleLeft, ZoomIn, ZoomOut, Download, MousePointer } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { saveProjectState, loadProjectState } from '../utils/projectUtils';
import NodeRenderer from './NodeRenderer';
import ToolbarButton from './ToolbarButton';

const MindMapView = ({ project }) => {
  const [showAIInput, setShowAIInput] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [draggedNode, setDraggedNode] = useState(null);
  const [draggedConnector, setDraggedConnector] = useState(null);
  const canvasRef = useRef(null);

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
      text: type === 'text' ? 'New Text' : '',
      connectorStart: type === 'connector' ? { x: 0, y: 0 } : null,
      connectorEnd: type === 'connector' ? { x: 100, y: 100 } : null,
    };
    setNodes([...nodes, newNode]);
  };

  const handleDragStart = (e, nodeId) => {
    setDraggedNode(nodeId);
  };

  const handleDrag = (e) => {
    if (draggedNode !== null) {
      const updatedNodes = nodes.map(node => {
        if (node.id === draggedNode) {
          return { ...node, x: e.clientX, y: e.clientY };
        }
        return node;
      });
      setNodes(updatedNodes);
    }
  };

  const handleDragEnd = () => {
    setDraggedNode(null);
  };

  const handleConnectorDragStart = (e, nodeId, end) => {
    setDraggedConnector({ nodeId, end });
  };

  const handleConnectorDrag = (e) => {
    if (draggedConnector) {
      const { nodeId, end } = draggedConnector;
      const updatedNodes = nodes.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            [end]: { x: e.clientX - canvasRef.current.offsetLeft, y: e.clientY - canvasRef.current.offsetTop }
          };
        }
        return node;
      });
      setNodes(updatedNodes);
    }
  };

  const handleConnectorDragEnd = () => {
    setDraggedConnector(null);
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Tabs at the top */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white shadow-md">
        <div className="flex space-x-2 p-2">
          <Button variant="ghost">Mind</Button>
          <Button variant="ghost">Text</Button>
          <Button variant="ghost">Time</Button>
          <Button variant="ghost">Map</Button>
        </div>
      </div>

      {/* Canvas */}
      <div 
        className="absolute inset-0 mt-12 bg-[#594BFF]"
        onMouseMove={(e) => {
          handleDrag(e);
          handleConnectorDrag(e);
        }}
        onMouseUp={() => {
          handleDragEnd();
          handleConnectorDragEnd();
        }}
        ref={canvasRef}
      >
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        >
          {nodes.map(node => (
            <NodeRenderer
              key={node.id}
              node={node}
              onDragStart={handleDragStart}
              onConnectorDragStart={handleConnectorDragStart}
            />
          ))}
        </div>
      </div>

      {/* Floating toolbar at the bottom */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex items-center space-x-2 bg-white bg-opacity-50 backdrop-blur-md rounded-full shadow-lg p-2">
          <ToolbarButton icon={<MousePointer className="h-4 w-4" />} label="Select" />
          <ToolbarButton icon={<Hand className="h-4 w-4" />} label="Pan" />
          <ToolbarButton icon={<Sparkles className="h-4 w-4" />} label="AI Node" onClick={handleAIClick} />
          <ToolbarButton icon={<Square className="h-4 w-4" />} label="Blank Node" onClick={() => handleAddNode('blank')} />
          <ToolbarButton icon={<StickyNote className="h-4 w-4" />} label="Post-it Node" onClick={() => handleAddNode('postit')} />
          <ToolbarButton icon={<Type className="h-4 w-4" />} label="Text Node" onClick={() => handleAddNode('text')} />
          <ToolbarButton icon={<Link className="h-4 w-4" />} label="Connector Node" onClick={() => handleAddNode('connector')} />
          <ToolbarButton icon={<Layers className="h-4 w-4" />} label="Grouped Section Node" />
          <ToolbarButton icon={<ToggleLeft className="h-4 w-4" />} label="Toggle 2D/3D View" />
          <ToolbarButton icon={<ZoomIn className="h-4 w-4" />} label="Zoom In" />
          <span className="text-sm font-medium">100%</span>
          <ToolbarButton icon={<ZoomOut className="h-4 w-4" />} label="Zoom Out" />
          <Button variant="ghost" className="rounded-full px-4">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {showAIInput && (
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg p-2 flex items-center space-x-2 max-w-xl w-full">
          <Button size="icon" className="rounded-full flex-shrink-0">
            <PlusIcon className="h-6 w-6" />
          </Button>
          <Input 
            type="text" 
            placeholder="Ask anything about this project" 
            className="flex-grow text-lg border-none focus:ring-0 rounded-full"
          />
          <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6">
            Ask
          </Button>
        </div>
      )}
    </div>
  );
};

export default MindMapView;