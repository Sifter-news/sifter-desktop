import React, { useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useDebug } from '@/contexts/DebugContext';
import TwoDNode from '@/components/node/TwoDNode';
import CanvasBackground from '@/components/canvas/CanvasBackground';
import CanvasControls from './CanvasControls';
import ConnectorLine from '@/components/node/ConnectorLine';
import AIChatPanel from '@/01_components/05_investigation/viewsControls/AIChatPanel';
import { useZoomPan } from '@/hooks/useZoomPan';
import { handleNodeDrag } from './handlers/nodeHandlers';
import { handleCanvasInteraction } from './handlers/canvasHandlers';
import { useConnectionHandling } from './hooks/useConnectionHandling';
import { NODE_STYLES } from '@/utils/nodeStyles';
import { useNodeRendering } from './hooks/useNodeRendering.jsx';
import { useNodeDeletion } from './hooks/useNodeDeletion';

const CanvasView = ({ 
  nodes, 
  setNodes, 
  onAddNode, 
  onUpdateNode, 
  onDeleteNode,
  focusedNodeId,
  onNodeFocus 
}) => {
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const [activeTool, setActiveTool] = useState('select');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const { setDebugData } = useDebug();
  const { zoom, position, handleZoom, handleWheel } = useZoomPan();
  
  const { handleDeleteNode } = useNodeDeletion(focusedNodeId, onDeleteNode);
  
  const { 
    connections, 
    activeConnection, 
    handleConnectionStart, 
    handleConnectionMove,
    handleConnectionEnd, 
    setActiveConnection 
  } = useConnectionHandling();

  const { renderNodes } = useNodeRendering({
    nodes,
    focusedNodeId,
    onNodeFocus,
    onUpdateNode,
    onDeleteNode: handleDeleteNode,
    zoom,
    handleConnectionStart,
    handleConnectionEnd,
    NODE_STYLES
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'c' && focusedNodeId) {
        const nodeToCopy = nodes.find(node => node.id === focusedNodeId);
        if (nodeToCopy) {
          const { id, x, y, ...nodeData } = nodeToCopy;
          localStorage.setItem('clipboard-node', JSON.stringify(nodeData));
          toast.success('Node copied to clipboard');
        }
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        const clipboardData = localStorage.getItem('clipboard-node');
        if (clipboardData) {
          const nodeData = JSON.parse(clipboardData);
          const rect = canvasRef.current.getBoundingClientRect();
          const x = (window.innerWidth / 2 - rect.left - position.x) / zoom;
          const y = (window.innerHeight / 2 - rect.top - position.y) / zoom;
          
          onAddNode({
            ...nodeData,
            x,
            y
          });
          toast.success('Node pasted from clipboard');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodes, focusedNodeId, zoom, position, onAddNode]);

  const handleMouseMove = (e) => {
    if (activeConnection) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - position.x) / zoom;
      const y = (e.clientY - rect.top - position.y) / zoom;
      handleConnectionMove({ clientX: x, clientY: y });
    }
  };

  const handleMouseUp = () => {
    if (activeConnection) {
      setActiveConnection(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const nodeType = e.dataTransfer.getData('nodeType');
    
    if (nodeType === 'postit') {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - position.x) / zoom;
      const y = (e.clientY - rect.top - position.y) / zoom;
      
      onAddNode({
        title: 'New Note',
        description: '',
        visualStyle: 'postit',
        color: 'bg-white',
        x,
        y,
        nodeType: 'generic'
      });
    }
  };

  const handleAddNode = () => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (window.innerWidth / 2 - rect.left - position.x) / zoom;
    const y = (window.innerHeight / 2 - rect.top - position.y) / zoom;
    
    onAddNode({
      title: 'New Node',
      description: '',
      visualStyle: 'default',
      color: 'bg-white',
      x,
      y,
      nodeType: 'generic'
    });
    toast.success('New node added');
  };

  const transformStyle = {
    transform: `scale(${zoom})`,
    transformOrigin: '0 0',
    willChange: 'transform',
    touchAction: 'none'
  };

  return (
    <div 
      className="w-full h-screen overflow-hidden cursor-auto relative bg-gray-900 scrollbar-hide"
      ref={canvasRef}
      tabIndex={0}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <CanvasBackground zoom={zoom} position={position} />
      
      <div 
        ref={contentRef}
        className="absolute inset-0 will-change-transform scrollbar-hide" 
        style={transformStyle}
        onWheel={handleWheel}
      >
        {connections.map((connection, index) => (
          <ConnectorLine
            key={`connection-${index}`}
            startX={connection.startX}
            startY={connection.startY}
            endX={connection.endX}
            endY={connection.endY}
          />
        ))}

        {activeConnection && (
          <ConnectorLine
            startX={activeConnection.startX}
            startY={activeConnection.startY}
            endX={activeConnection.endX}
            endY={activeConnection.endY}
            isDashed
          />
        )}

        {renderNodes()}
      </div>

      <CanvasControls 
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        zoom={zoom}
        handleZoom={handleZoom}
        onAIChatToggle={() => setIsAIChatOpen(!isAIChatOpen)}
        isAIChatOpen={isAIChatOpen}
        onAddNode={handleAddNode}
      />

      <AIChatPanel
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        initialContext={`Viewing canvas with ${nodes.length} nodes`}
      />
    </div>
  );
};

export default CanvasView;
