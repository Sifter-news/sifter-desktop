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

  const ToolButton = ({ icon, label, onClick }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="ghost" className="rounded-full" onClick={onClick}>
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

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

  const renderNode = (node) => {
    switch (node.type) {
      case 'blank':
        return <div className="w-20 h-20 bg-white rounded-md shadow-md flex items-center justify-center">Node</div>;
      case 'postit':
        return (
          <div className="w-32 h-32 bg-yellow-200 rounded-md shadow-md flex items-center justify-center relative">
            <div className="absolute top-0 left-0 w-4 h-4 bg-yellow-300 rounded-tl-md hover:bg-yellow-400"></div>
            <div className="absolute top-0 right-0 w-4 h-4 bg-yellow-300 rounded-tr-md hover:bg-yellow-400"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 bg-yellow-300 rounded-bl-md hover:bg-yellow-400"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-yellow-300 rounded-br-md hover:bg-yellow-400"></div>
            <p className="text-center p-2">{node.text || 'Post-it'}</p>
          </div>
        );
      case 'text':
        return <div className="p-2 bg-white rounded shadow-md">{node.text}</div>;
      case 'connector':
        return (
          <svg className="absolute" style={{ left: 0, top: 0, width: '100%', height: '100%' }}>
            <line
              x1={node.connectorStart.x}
              y1={node.connectorStart.y}
              x2={node.connectorEnd.x}
              y2={node.connectorEnd.y}
              stroke="black"
              strokeWidth="2"
            />
            <circle
              cx={node.connectorStart.x}
              cy={node.connectorStart.y}
              r="5"
              fill="red"
              onMouseDown={(e) => handleConnectorDragStart(e, node.id, 'connectorStart')}
            />
            <circle
              cx={node.connectorEnd.x}
              cy={node.connectorEnd.y}
              r="5"
              fill="blue"
              onMouseDown={(e) => handleConnectorDragStart(e, node.id, 'connectorEnd')}
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="bg-[#594BFF] min-h-[calc(100vh-120px)] relative flex items-center justify-center"
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
          <div
            key={node.id}
            className="absolute cursor-move"
            style={{ left: `${node.x}px`, top: `${node.y}px` }}
            onMouseDown={(e) => handleDragStart(e, node.id)}
          >
            {renderNode(node)}
          </div>
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
      <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg p-2 flex items-center space-x-2">
        <ToolButton icon={<MousePointer className="h-4 w-4" />} label="Select" />
        <ToolButton icon={<Hand className="h-4 w-4" />} label="Pan" />
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
        <ToolButton icon={<ZoomIn className="h-4 w-4" />} label="Zoom In" />
        <span className="text-sm font-medium">100%</span>
        <ToolButton icon={<ZoomOut className="h-4 w-4" />} label="Zoom Out" />
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
