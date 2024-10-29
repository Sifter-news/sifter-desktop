import React, { useState, useRef } from 'react';
import { useZoomPan } from '../utils/canvasUtils';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import AISidePanel from './AISidePanel';
import NodeEditorModal from './node/NodeEditorModal';
import { toast } from 'sonner';

const MindMapView = ({ 
  project, 
  nodes, 
  setNodes, 
  onAddNode, 
  onUpdateNode, 
  onDeleteNode,
  focusedNodeId,
  onNodeFocus 
}) => {
  const [activeTool, setActiveTool] = useState('select');
  const [editingNode, setEditingNode] = useState(null);
  const canvasRef = useRef(null);

  const {
    zoom,
    position,
    isPanning,
    handleZoom,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
    handleWheel,
    setPosition
  } = useZoomPan();

  const handleNodePositionUpdate = (nodeId, newPosition) => {
    onUpdateNode(nodeId, {
      x: newPosition.x,
      y: newPosition.y
    });
  };

  const handleAIConversation = (node) => {
    toast.error("AI Conversation not implemented yet");
  };

  return (
    <div className="h-full w-full relative">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <Toolbar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          handleZoom={handleZoom}
          zoom={zoom}
        />
      </div>

      <Canvas
        ref={canvasRef}
        nodes={nodes}
        setNodes={setNodes}
        zoom={zoom}
        position={position}
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        handlePanStart={handlePanStart}
        handlePanMove={handlePanMove}
        handlePanEnd={handlePanEnd}
        handleWheel={handleWheel}
        onNodeUpdate={onUpdateNode}
        focusedNodeId={focusedNodeId}
        onNodeFocus={onNodeFocus}
        onNodeDelete={onDeleteNode}
        onAIConversation={handleAIConversation}
        onNodePositionUpdate={handleNodePositionUpdate}
      />

      {editingNode && (
        <NodeEditorModal
          isOpen={!!editingNode}
          onClose={() => setEditingNode(null)}
          node={editingNode}
          onUpdate={(id, updates) => {
            onUpdateNode(id, updates);
            setEditingNode(null);
          }}
          onDelete={onDeleteNode}
        />
      )}
    </div>
  );
};

export default MindMapView;