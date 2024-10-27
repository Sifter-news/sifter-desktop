import React, { useState, useRef } from 'react';
import { useZoomPan, findAvailablePosition, snapToGrid } from '../utils/canvasUtils';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import AISidePanel from './AISidePanel';
import ReportList from './ReportList';
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from 'sonner';

const MindMapView = ({ project, nodes, setNodes, onAddNode, onUpdateNode, onDeleteNode, reports, onAddReport, onUpdateReport }) => {
  const [activeTool, setActiveTool] = useState('select');
  const [focusedNodeId, setFocusedNodeId] = useState(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [initialAIMessage, setInitialAIMessage] = useState('');
  const canvasRef = useRef(null);

  const {
    zoom,
    position,
    handleZoom,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
  } = useZoomPan();

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

  return (
    <div className="flex h-[calc(100vh-64px)] w-screen overflow-hidden">
      <div className="flex-grow relative">
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
          onNodeUpdate={onUpdateNode}
          focusedNodeId={focusedNodeId}
          onNodeFocus={setFocusedNodeId}
          onNodeDelete={onDeleteNode}
          onAIConversation={handleAIConversation}
          onNodePositionUpdate={handleNodePositionUpdate}
        />
        <Toolbar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
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
    </div>
  );
};

export default MindMapView;