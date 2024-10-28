import React, { useState, useRef, useEffect } from 'react';
import { useZoomPan, findAvailablePosition } from '../utils/canvasUtils';
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
  const [activeTool, setActiveTool] = useState('select');
  const canvasRef = useRef(null);

  const {
    zoom,
    position,
    handleZoom,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
    handleWheel,
    setPosition
  } = useZoomPan();

  useEffect(() => {
    if (focusedNodeId && canvasRef.current) {
      const focusedNode = nodes.find(node => node.id === focusedNodeId);
      if (focusedNode) {
        const rect = canvasRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const newX = centerX - (focusedNode.x * zoom);
        const newY = centerY - (focusedNode.y * zoom);
        setPosition({ x: newX, y: newY });
      }
    }
  }, [focusedNodeId, nodes, zoom, setPosition]);

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

  const handleAddNode = (options = {}) => {
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const centerX = (canvasRect.width / 2 - position.x) / zoom;
    const centerY = (canvasRect.height / 2 - position.y) / zoom;
    
    const newNode = {
      id: Date.now().toString(),
      type: options.type || 'generic',
      visualStyle: options.type === 'postit' ? 'postit' : 'default',
      title: 'New Node',
      description: '',
      x: centerX,
      y: centerY,
      width: 200,
      height: options.type === 'postit' ? 200 : 100,
      color: '#FFFFFF',
      backgroundColor: options.type === 'postit' ? '#FFF8DC' : '#FFFFFF',
    };
    
    onAddNode(newNode);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const nodeType = e.dataTransfer.getData('nodeType');
    if (nodeType === 'postit') {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - position.x) / zoom;
      const y = (e.clientY - rect.top - position.y) / zoom;
      
      const newNode = {
        id: Date.now().toString(),
        type: 'postit',
        visualStyle: 'postit',
        title: 'New Post-it',
        description: '',
        x,
        y,
        width: 200,
        height: 200,
        color: '#000000',
        backgroundColor: '#FFF8DC',
      };
      
      onAddNode(newNode);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
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
      <div 
        className="flex-grow relative"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div 
          className="absolute inset-0" 
          style={{
            width: '5000px',
            height: '5000px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '120px 120px',
            transformOrigin: '0 0',
            transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
          }}
        >
          {nodes.map(node => (
            <NodeRenderer
              key={node.id}
              node={node}
              zoom={zoom}
              onNodeUpdate={onUpdateNode}
              onFocus={onNodeFocus}
              isFocused={focusedNodeId === node.id}
              onDelete={onDeleteNode}
              onAIConversation={handleAIConversation}
              onNodePositionUpdate={handleNodePositionUpdate}
              isDraggable={activeTool !== 'pan'}
            />
          ))}
        </div>
        <Toolbar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          handleZoom={handleZoom}
          zoom={zoom}
          nodes={nodes}
          onAddNode={handleAddNode}
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
          projectId={project?.id}
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
