import React from 'react';

const DebugStateSection = ({ debugData }) => {
  const getToolDescription = (tool) => {
    switch (tool) {
      case 'pan':
        return 'Pans view in X/Y axes (hold Space)';
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
        return 'Mind Map View';
      case 'timeline':
        return 'Timeline View';
      case 'map':
        return 'Map View';
      default:
        return view || 'Unknown View';
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-white/80">Current State</h3>
      <div className="bg-black/50 p-2 rounded space-y-2">
        <p className="text-xs">Page: Project View</p>
        <p className="text-xs">Canvas: {getCurrentView()}</p>
        <p className="text-xs">Active Tool: {debugData?.activeTool || 'select'}</p>
        <p className="text-xs text-gray-400">{getToolDescription(debugData?.activeTool)}</p>
      </div>
    </div>
  );
};

export default DebugStateSection;