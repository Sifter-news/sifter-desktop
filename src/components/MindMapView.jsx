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
import { useZoomPan } from '../utils/canvasUtils';
import ToolButton from './ToolbarButton';
import NodeRenderer from './NodeRenderer';

const MindMapView = ({ project }) => {
  const [showAIInput, setShowAIInput] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [draggedNode, setDraggedNode] = useState(null);
  const [draggedConnector, setDraggedConnector] = useState(null);
  const [activeTool, setActiveTool] = useState('select');
  const canvasRef = useRef(null);

  const {
    zoom,
    position,
    isPanning,
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
      text: type === 'text' ? 'New Text' : '',
      connectorStart: type === 'connector' ? { x: 0, y: 0 } : null,
      connectorEnd: type === 'connector' ? { x: 100, y: 100 } : null,
    };
    setNodes([...nodes, newNode]);
  };

  const handleDragStart = (e, nodeId) => {
    if (activeTool === 'select') {
      setDraggedNode(nodeId);
    }
  };

  const handleDrag = (e) => {
    if (draggedNode !== null && activeTool === 'select') {
      const updatedNodes = nodes.map(node => {
        if (node.id === draggedNode) {
          return { ...node, x: e.clientX / zoom - position.x, y: e.clientY / zoom - position.y };
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
    if (activeTool === 'select') {
      setDraggedConnector({ nodeId, end });
    }
  };

  const handleConnectorDrag = (e) => {
    if (draggedConnector && activeTool === 'select') {
      const { nodeId, end } = draggedConnector;
      const updatedNodes = nodes.map(node => {
        if (node.id === nodeId) {
          return {
            ...node,
            [end]: { 
              x: (e.clientX - canvasRef.current.offsetLeft) / zoom - position.x, 
              y: (e.clientY - canvasRef.current.offsetTop) / zoom - position.y 
            }
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

  const handleCanvasMouseDown = (e) => {
    if (activeTool === 'pan') {
      handlePanStart();
    }
  };

  const handleCanvasMouseMove = (e) => {
    handleDrag(e);
    handleConnectorDrag(e);
    if (activeTool === 'pan') {
      handlePanMove(e);
    }
  };

  const handleCanvasMouseUp = () => {
    handleDragEnd();
    handleConnectorDragEnd();
    if (activeTool === 'pan') {
      handlePanEnd();
    }
  };

  return (
    <div 
      className="bg-[#594BFF] min-h-[calc(100vh-120px)] relative flex items-center justify-center overflow-hidden"
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
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
          transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
        }}
      >
        {nodes.map(node => (
          <NodeRenderer
            key={node.id}
            node={node}
            onDragStart={handleDragStart}
            onConnectorDragStart={handleConnectorDragStart}
            zoom={zoom}
          />
        ))}
      </div>
      {showAIInput && (
        <div className="bg-white rounded-full shadow-lg p-2 flex items-center space-x-2 max-w-xl w-full">
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
      <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-80 backdrop-blur-sm rounded-full shadow-lg p-2 flex items-center space-x-2">
        <ToolButton 
          icon={activeTool === 'select' ? <MousePointer className="h-4 w-4" /> : <Hand className="h-4 w-4" />} 
          label={activeTool === 'select' ? "Select" : "Pan"} 
          onClick={() => setActiveTool(activeTool === 'select' ? 'pan' : 'select')}
        />
        <ToolButton icon={<Sparkles className="h-4 w-4" />} label="AI Node" onClick={handleAIClick} />
        <ToolButton icon={<Square className="h-4 w-4" />} label="Blank Node" onClick={() => handleAddNode('blank')} />
        <ToolButton icon={<StickyNote className="h-4 w-4" />} label="Post-it Node" onClick={() => handleAddNode('postit')} />
        <ToolButton icon={<Type className="h-4 w-4" />} label="Text Node" onClick={() => handleAddNode('text')} />
        <ToolButton icon={<Link className="h-4 w-4" />} label="Connector Node" onClick={() => handleAddNode('connector')} />
        <ToolButton icon={<Layers className="h-4 w-4" />} label="Grouped Section Node" />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-1">
                <Button size="icon" variant="ghost" className="rounded-full">
                  <ToggleLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">2D</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle 2D/3D View</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <ToolButton icon={<ZoomIn className="h-4 w-4" />} label="Zoom In" onClick={() => handleZoom(0.1)} />
        <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
        <ToolButton icon={<ZoomOut className="h-4 w-4" />} label="Zoom Out" onClick={() => handleZoom(-0.1)} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="rounded-full px-4">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export Mind Map</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default MindMapView;