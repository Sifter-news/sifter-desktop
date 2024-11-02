import React, { useState } from 'react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import Canvas from '@/components/Canvas';
import { useZoomPan } from '@/hooks/useZoomPan';
import NavigatorPanel from '../../viewsControls/NavigatorPanel';
import Toolbar from '../../viewsControls/toolbar/Toolbar';
import ViewToggle from '../../viewsControls/ViewToggle';

const CanvasView = ({ 
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
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(true);
  const {
    zoom,
    position,
    handleZoom,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
    handleWheel
  } = useZoomPan(1);

  // Fetch nodes for the current project
  const { data: projectNodes, isLoading } = useQuery({
    queryKey: ['nodes', project?.id],
    queryFn: async () => {
      if (!project?.id) return [];
      
      const { data, error } = await supabase
        .from('node')
        .select('*')
        .eq('investigation_id', project.id);
        
      if (error) {
        toast.error('Failed to load nodes');
        throw error;
      }

      const transformedNodes = data.map(node => ({
        id: node.id,
        title: node.title || '',
        description: node.description || '',
        x: node.position_x || 0,
        y: node.position_y || 0,
        width: node.width || 200,
        height: node.height || 100,
        visualStyle: node.visual_style || 'default',
        nodeType: node.node_type || 'generic',
        avatar: node.avatar || '/default-image.png'
      }));

      setNodes(transformedNodes);
      return transformedNodes;
    },
    enabled: !!project?.id
  });

  const handleNodeUpdate = async (nodeId, updates) => {
    try {
      await onUpdateNode(nodeId, updates);
      toast.success('Node updated successfully');
    } catch (error) {
      toast.error('Failed to update node');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading nodes...</div>;
  }

  return (
    <div className="relative h-full bg-white">
      {/* Left Navigator Panel */}
      <div className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 z-50 transition-transform duration-300 ${
        isNavigatorOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <NavigatorPanel
          nodes={nodes}
          onNodeSelect={onNodeFocus}
          selectedNodeId={focusedNodeId}
        />
      </div>

      {/* Main Canvas Area */}
      <div className={`h-full transition-all duration-300 ${
        isNavigatorOpen ? 'ml-64' : 'ml-0'
      }`}>
        {/* Top Toolbar */}
        <div className="fixed top-16 left-0 right-0 h-12 bg-white border-b z-40 flex items-center px-4">
          <ViewToggle 
            currentView="canvas"
            onViewChange={() => {}}
          />
        </div>

        {/* Bottom Toolbar */}
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
          <Toolbar
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            handleZoom={handleZoom}
            zoom={zoom}
            viewMode="2d"
            onViewModeChange={() => {}}
            onAddNode={onAddNode}
          />
        </div>

        {/* Canvas */}
        <div className="absolute inset-0 pt-12">
          <Canvas
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
            onNodeUpdate={handleNodeUpdate}
            focusedNodeId={focusedNodeId}
            onNodeFocus={onNodeFocus}
            onNodeDelete={onDeleteNode}
          />
        </div>
      </div>
    </div>
  );
};

export default CanvasView;