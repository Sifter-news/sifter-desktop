import React, { useState } from 'react';
import { toast } from 'sonner';
import Canvas from '@/components/Canvas';
import Toolbar from '@/components/Toolbar';
import { useZoomPan } from '@/hooks/useZoomPan';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import NavigatorPanel from '../../viewsControls/NavigatorPanel';

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
  const [showNavigator, setShowNavigator] = useState(true);
  const {
    zoom,
    position,
    handleZoom,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
    handleWheel
  } = useZoomPan(1);

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

  const handleNodePositionUpdate = (nodeId, position) => {
    handleNodeUpdate(nodeId, {
      x: position.x,
      y: position.y
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading nodes...</div>;
  }

  return (
    <div className="flex h-full bg-black">
      {showNavigator && (
        <div className="w-64 border-r border-white/10">
          <NavigatorPanel
            nodes={nodes}
            selectedNodeId={focusedNodeId}
            onNodeSelect={onNodeFocus}
          />
        </div>
      )}
      
      <div className="flex-1 relative">
        <nav className="fixed top-0 left-0 right-0 z-10">
          <Toolbar 
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            handleZoom={handleZoom}
            zoom={zoom}
            viewMode="2d"
            onViewModeChange={() => {}}
            onAddNode={onAddNode}
            onToggleNavigator={() => setShowNavigator(!showNavigator)}
          />
        </nav>

        <div className="absolute inset-0 pt-16">
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
            onNodePositionUpdate={handleNodePositionUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default CanvasView;