import React, { useRef } from 'react';
import { toast } from 'sonner';
import { useDebug } from '@/contexts/DebugContext';
import CanvasBackground from '@/components/canvas/CanvasBackground';
import CanvasControls from './CanvasControls';
import AIChatPanel from '@/01_components/05_investigation/viewsControls/AIChatPanel';
import { useZoomPan } from '@/hooks/useZoomPan';
import { useConnectionHandling } from './hooks/useConnectionHandling';
import { useNodeRendering } from './hooks/useNodeRendering.jsx';
import { useNodeDeletion } from './hooks/useNodeDeletion';
import { useClipboard } from './hooks/useClipboard';
import { useCanvasState } from './hooks/useCanvasState';
import CanvasContent from './components/CanvasContent';

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
  const { setDebugData, showGuides } = useDebug();
  
  // Custom hooks
  const { zoom, position, handleZoom, handleWheel } = useZoomPan();
  const { handleDeleteNode } = useNodeDeletion(focusedNodeId, onDeleteNode);
  const {
    activeTool,
    isAIChatOpen,
    handleToolChange,
    handleAIChatToggle
  } = useCanvasState();

  const { 
    connections, 
    activeConnection,
    selectedConnection,
    handleConnectionStart, 
    handleConnectionMove,
    handleConnectionEnd,
    selectConnection,
    setActiveConnection,
    setSelectedConnection,
    setConnections
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
    onAddNode
  });

  useClipboard({
    nodes,
    focusedNodeId,
    onAddNode,
    canvasRef,
    position,
    zoom
  });

  const handleDragOver = (e) => {
    e.preventDefault();
    if (e.dataTransfer.types.includes('connectionType')) {
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const connectionType = e.dataTransfer.getData('connectionType');
    if (connectionType) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - position.x) / zoom;
      const y = (e.clientY - rect.top - position.y) / zoom;
      
      const newConnection = {
        id: `connection-${Date.now()}`,
        startX: x,
        startY: y,
        endX: x,
        endY: y,
        isAnchored: true,
        sourceNodeId: null,
        targetNodeId: null
      };
      
      setConnections(prev => [...prev, newConnection]);
      toast.success('Connection added to canvas');
    }
  };

  const handleMouseMove = (e) => {
    if (activeConnection || selectedConnection) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - position.x) / zoom;
      const y = (e.clientY - rect.top - position.y) / zoom;
      handleConnectionMove({ clientX: x, clientY: y });

      // Update debug data
      setDebugData(prev => ({
        ...prev,
        canvas: {
          ...prev?.canvas,
          mousePosition: { x, y },
          activeConnection: activeConnection ? {
            start: { x: activeConnection.startX, y: activeConnection.startY },
            end: { x: activeConnection.endX, y: activeConnection.endY },
            offset: 48
          } : null,
          zoom,
          position
        }
      }));
    }
  };

  const handleMouseUp = () => {
    if (activeConnection) {
      setActiveConnection(null);
    }
    if (selectedConnection) {
      setSelectedConnection(null);
    }
  };

  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget || e.target === contentRef.current) {
      onNodeFocus(null);
      setSelectedConnection(null);
    }
  };

  const transformStyle = {
    transform: `scale(${zoom})`,
    transformOrigin: '0 0',
    willChange: 'transform',
    touchAction: 'none'
  };

  // Debug overlay
  const DebugOverlay = () => {
    if (!showGuides) return null;
    
    return (
      <div className="fixed top-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50">
        <div>Zoom: {zoom.toFixed(2)}x</div>
        <div>Position: ({position.x.toFixed(0)}, {position.y.toFixed(0)})</div>
        <div>Connections: {connections.length}</div>
        <div>Active Connection: {activeConnection ? '✓' : '×'}</div>
        <div>Connection Offset: 48px</div>
      </div>
    );
  };

  return (
    <div 
      className="w-full h-screen overflow-hidden cursor-auto relative bg-gray-900 scrollbar-hide"
      ref={canvasRef}
      tabIndex={0}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleCanvasClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <CanvasBackground zoom={zoom} position={position} />
      
      <CanvasContent 
        contentRef={contentRef}
        transformStyle={transformStyle}
        connections={connections}
        activeConnection={activeConnection}
        selectedConnection={selectedConnection}
        selectConnection={selectConnection}
        renderNodes={renderNodes}
        onWheel={handleWheel}
      />

      <CanvasControls 
        activeTool={activeTool}
        setActiveTool={handleToolChange}
        zoom={zoom}
        handleZoom={handleZoom}
        onAIChatToggle={handleAIChatToggle}
        isAIChatOpen={isAIChatOpen}
        onAddNode={() => {
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
        }}
      />

      <DebugOverlay />

      <AIChatPanel
        isOpen={isAIChatOpen}
        onClose={() => handleAIChatToggle()}
        initialContext={`Viewing canvas with ${nodes.length} nodes`}
      />
    </div>
  );
};

export default CanvasView;