import React, { useState } from 'react';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/config/supabase';
import Header from '@/01_components/01_global/GlobalHeader/Header';
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

  if (isLoading) {
    return <div className="flex items-center justify-center h-full">Loading nodes...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Global Header */}
      <Header 
        user={{
          name: 'User Name',
          avatar: '/default-image.png'
        }}
        projectName={project?.title || 'Untitled Project'}
      />

      <div className="flex-1 flex relative">
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

        {/* Main Content Area */}
        <div className={`flex-1 flex flex-col transition-all duration-300 ${
          isNavigatorOpen ? 'ml-64' : 'ml-0'
        }`}>
          {/* View Controls */}
          <div className="h-12 bg-black/50 border-b border-white/10 flex items-center px-4">
            <ViewToggle 
              currentView="canvas"
              onViewChange={() => {}}
            />
          </div>

          {/* Canvas Area */}
          <div className="flex-1 relative bg-black">
            {/* Canvas content will go here */}
          </div>

          {/* Bottom Toolbar */}
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
            <Toolbar
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              viewMode="2d"
              onViewModeChange={() => {}}
              onAddNode={onAddNode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasView;