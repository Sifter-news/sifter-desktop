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
import { useKeyboardModifiers } from './hooks/useKeyboardModifiers';

const CanvasView = ({ 
  nodes, 
  onUpdateNode,
  onDeleteNode,
  onAddNode,
  focusedNodeId,
  onNodeFocus,
  defaultView = 'canvas'
}) => {
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const [activeTool, setActiveTool] = useState('select');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const { setDebugData } = useDebug();
  const { zoom, position, handleZoom, handleWheel, setPosition } = useZoomPan();
  const { isSpacePressed } = useKeyboardModifiers();
  
  const { handleDeleteNode } = useNodeDeletion(focusedNodeId, onDeleteNode);
  
  const { 
    isConnecting,
    startNodeId,
    handleConnectionStart,
    handleConnectionMove,
    handleConnectionEnd,
    temporaryConnection
  } = useConnectionHandling();

  const { renderedNodes } = useNodeRendering({
    nodes,
    zoom,
    position,
    focusedNodeId,
    onNodeFocus,
    onUpdateNode,
    isConnecting,
    handleConnectionStart,
    handleConnectionEnd,
    NODE_STYLES
  });

  // Handle clipboard operations
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'c' && focusedNodeId) {
        const nodeToCopy = nodes.find(node => node.id === focusedNodeId);
        if (nodeToCopy) {
          localStorage.setItem('copiedNode', JSON.stringify(nodeToCopy));
          toast.success('Node copied to clipboard');
        }
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        const copiedNode = localStorage.getItem('copiedNode');
        if (copiedNode) {
          const node = JSON.parse(copiedNode);
          const newNode = {
            ...node,
            id: crypto.randomUUID(),
            x: node.x + 20,
            y: node.y + 20
          };
          onAddNode(newNode);
          toast.success('Node pasted from clipboard');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedNodeId, nodes, onAddNode]);

  const handleMouseMove = (e) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    
    if (isConnecting) {
      const x = (e.clientX - rect.left - position.x) / zoom;
      const y = (e.clientY - rect.top - position.y) / zoom;
      handleConnectionMove({ clientX: x, clientY: y });
    } else if (isSpacePressed && e.buttons === 1) {
      setIsPanning(true);
      setPosition(prev => ({
        x: prev.x + e.movementX,
        y: prev.y + e.movementY
      }));
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget || e.target === contentRef.current) {
      onNodeFocus(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const data = e.dataTransfer.getData('application/json');
    
    if (data) {
      try {
        const nodeData = JSON.parse(data);
        const dropX = (e.clientX - rect.left - position.x) / zoom;
        const dropY = (e.clientY - rect.top - position.y) / zoom;
        
        const newNode = {
          ...nodeData,
          id: crypto.randomUUID(),
          x: dropX,
          y: dropY,
          width: nodeData.width || 200,
          height: nodeData.height || 100
        };
        
        onAddNode(newNode);
      } catch (error) {
        console.error('Error parsing dropped data:', error);
      }
    }
  };

  const contentStyle = {
    position: 'absolute',
    top: position.y,
    left: position.x,
    transform: `scale(${zoom})`,
    transformOrigin: '0 0',
    willChange: 'transform',
    touchAction: 'none'
  };

  return (
    <div 
      className="w-full h-screen overflow-hidden relative bg-gray-900 scrollbar-hide"
      ref={canvasRef}
      tabIndex={0}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleCanvasClick}
      onWheel={handleWheel}
      style={{ cursor: isSpacePressed ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
    >
      <CanvasBackground zoom={zoom} position={position} />
      
      <div ref={contentRef} style={contentStyle}>
        {renderedNodes}
        
        {isConnecting && temporaryConnection && (
          <ConnectorLine
            startX={temporaryConnection.startX}
            startY={temporaryConnection.startY}
            endX={temporaryConnection.endX}
            endY={temporaryConnection.endY}
            isTemporary={true}
          />
        )}
      </div>

      <CanvasControls
        zoom={zoom}
        onZoomChange={handleZoom}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        isAIChatOpen={isAIChatOpen}
        setIsAIChatOpen={setIsAIChatOpen}
      />

      {isAIChatOpen && (
        <AIChatPanel
          isOpen={isAIChatOpen}
          onClose={() => setIsAIChatOpen(false)}
        />
      )}
    </div>
  );
};

export default CanvasView;