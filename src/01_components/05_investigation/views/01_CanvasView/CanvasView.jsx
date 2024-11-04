import React, { useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useDebug } from '@/contexts/DebugContext';
import CanvasBackground from '@/components/canvas/CanvasBackground';
import CanvasControls from './CanvasControls';
import AIChatPanel from '@/01_components/05_investigation/viewsControls/AIChatPanel';
import { useZoomPan } from '@/hooks/useZoomPan';
import { useConnectionHandling } from './hooks/useConnectionHandling';
import { useNodeRendering } from './hooks/useNodeRendering.jsx';
import { useNodeDeletion } from './hooks/useNodeDeletion';
import ConnectionLines from './components/ConnectionLines';
import { useClipboard } from './hooks/useClipboard';

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
    selectedConnection,
    handleConnectionStart, 
    handleConnectionMove,
    handleConnectionEnd,
    selectConnection,
    setActiveConnection,
    setSelectedConnection
  } = useConnectionHandling();

  const { renderNodes } = useNodeRendering({
    nodes,
    focusedNodeId,
    onNodeFocus,
    onUpdateNode,
    onDeleteNode: handleDeleteNode,
    zoom,
    handleConnectionStart,
    handleConnectionEnd
  });

  useClipboard({
    nodes,
    focusedNodeId,
    onAddNode,
    canvasRef,
    position,
    zoom
  });

  const handleMouseMove = (e) => {
    if (activeConnection || selectedConnection) {
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

  return (
    <div 
      className="w-full h-screen overflow-hidden cursor-auto relative bg-gray-900 scrollbar-hide"
      ref={canvasRef}
      tabIndex={0}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleCanvasClick}
    >
      <CanvasBackground zoom={zoom} position={position} />
      
      <div 
        ref={contentRef}
        className="absolute inset-0 will-change-transform scrollbar-hide" 
        style={transformStyle}
        onWheel={handleWheel}
      >
        <ConnectionLines 
          connections={connections}
          activeConnection={activeConnection}
          selectedConnectionId={selectedConnection?.id}
          onSelectConnection={selectConnection}
        />
        {renderNodes()}
      </div>

      <CanvasControls 
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        zoom={zoom}
        handleZoom={handleZoom}
        onAIChatToggle={() => setIsAIChatOpen(!isAIChatOpen)}
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

      <AIChatPanel
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        initialContext={`Viewing canvas with ${nodes.length} nodes`}
      />
    </div>
  );
};

export default CanvasView;