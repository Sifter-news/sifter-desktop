import React, { useState } from 'react';
import Toolbar from '@/components/Toolbar';
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
  const [zoom, setZoom] = useState(1);

  const handleZoom = (newZoom) => {
    setZoom(newZoom);
  };

  return (
    <div className="flex h-full">
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

        <div className="absolute inset-0 pt-16 bg-red-500">
          {/* Red background canvas area */}
        </div>
      </div>
    </div>
  );
};

export default CanvasView;
