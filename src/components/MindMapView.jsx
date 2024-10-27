import React, { useState, useRef, useEffect } from 'react';
import { useZoomPan, findAvailablePosition, snapToGrid } from '../utils/canvasUtils';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import AISidePanel from './AISidePanel';
import ReportList from './ReportList';
import NodeEditorModal from './node/NodeEditorModal';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';

const MindMapView = ({ 
  project, 
  nodes, 
  setNodes, 
  onAddNode, 
  onUpdateNode, 
  onDeleteNode, 
  reports, 
  onAddReport, 
  onUpdateReport,
  focusedNodeId,
  onNodeFocus 
}) => {
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [initialAIMessage, setInitialAIMessage] = useState('');
  const [selectedNode, setSelectedNode] = useState(null);
  const canvasRef = useRef(null);

  const {
    zoom,
    position,
    handleZoom,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
  } = useZoomPan();

  // Effect to center the focused node
  useEffect(() => {
    if (focusedNodeId && canvasRef.current) {
      const focusedNode = nodes.find(node => node.id === focusedNodeId);
      if (focusedNode) {
        const rect = canvasRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Calculate the position to center the node
        const newX = centerX - (focusedNode.x * zoom);
        const newY = centerY - (focusedNode.y * zoom);
        
        // Update the position
        handlePanMove({ 
          movementX: newX - position.x, 
          movementY: newY - position.y 
        });
      }
    }
  }, [focusedNodeId]);

  const handleNodePositionUpdate = async (nodeId, x, y) => {
    try {
      const { error } = await supabase
        .from('node')
        .update({
          position_x: x,
          position_y: y,
        })
        .eq('id', nodeId);

      if (error) throw error;

      setNodes(prevNodes =>
        prevNodes.map(node =>
          node.id === nodeId
            ? { ...node, x, y }
            : node
        )
      );
    } catch (error) {
      console.error('Error updating node position:', error);
      toast.error('Failed to save node position');
    }
  };

  const handleAddGenericNode = () => {
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const centerX = (canvasRect.width / 2 - position.x) / zoom;
    const centerY = (canvasRect.height / 2 - position.y) / zoom;
    
    const newNode = {
      id: Date.now().toString(),
      type: 'generic',
      visualType: 'pill',
      title: 'New Node',
      description: '',
      x: centerX,
      y: centerY,
      width: 200,
      height: 100,
      color: '#FFFFFF',
      backgroundColor: '#FFFFFF',
    };
    
    onAddNode(newNode);
  };

  const handleAIConversation = (node) => {
    setInitialAIMessage(`Tell me about the node "${node.title}"`);
    setSidePanelOpen(true);
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-screen overflow-hidden">
      <div className="flex-grow relative">
        <Canvas
          ref={canvasRef}
          nodes={nodes}
          setNodes={setNodes}
          zoom={zoom}
          position={position}
          handlePanStart={handlePanStart}
          handlePanMove={handlePanMove}
          handlePanEnd={handlePanEnd}
          onNodeUpdate={onUpdateNode}
          focusedNodeId={focusedNodeId}
          onNodeFocus={onNodeFocus}
          onNodeDelete={onDeleteNode}
          onAIConversation={handleAIConversation}
          onNodePositionUpdate={handleNodePositionUpdate}
          onNodeClick={handleNodeClick}
        />
        <Toolbar
          handleZoom={handleZoom}
          zoom={zoom}
          nodes={nodes}
          onAddNode={handleAddGenericNode}
        />
      </div>
      <AISidePanel
        isOpen={sidePanelOpen}
        onClose={() => setSidePanelOpen(false)}
        initialQuestion={initialAIMessage}
        onSendMessage={(message) => {
          console.log("Sending message to AI:", message);
        }}
      />
      <div className="fixed bottom-12 right-12 z-50">
        <ReportList
          reports={reports}
          onAddReport={onAddReport}
          onEditReport={onUpdateReport}
        />
      </div>
      <NodeEditorModal
        isOpen={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        node={selectedNode}
        onUpdate={onUpdateNode}
      />
    </div>
  );
};

export default MindMapView;
