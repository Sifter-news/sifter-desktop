import React from 'react';

const DebugStateSection = ({ debugData }) => {
  const getToolDescription = (tool) => {
    switch (tool) {
      case 'pan':
        return 'Pans view in X/Y axes, Orbit in 3D (hold Space)';
      case 'select':
        return 'Select and move nodes';
      default:
        return 'No tool selected';
    }
  };

  const getCurrentView = () => {
    const view = debugData?.currentView;
    switch (view) {
      case 'mindmap':
        return 'Mind Map';
      case 'timeline':
        return 'Timeline';
      case 'map':
        return 'Map';
      default:
        return view || 'Unknown View';
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-white/80">Current State</h3>
      <div className="bg-black/50 p-2 rounded space-y-2">
        <div className="space-y-1">
          <p className="text-xs font-medium text-white/80">Project View</p>
          <div className="pl-2">
            <p className="text-xs">Canvas: {getCurrentView()}</p>
            {debugData?.currentView === 'mindmap' && (
              <>
                <p className="text-xs pl-2">Perspective: {debugData?.viewMode || '2D'}</p>
                <p className="text-xs pl-2">Active Tool: {debugData?.activeTool || 'select'}</p>
                <p className="text-xs pl-2 text-gray-400">{getToolDescription(debugData?.activeTool)}</p>
              </>
            )}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-white/80">State</p>
          <div className="pl-2">
            <p className="text-xs">Current Perspective: {debugData?.viewMode || '2D'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugStateSection;