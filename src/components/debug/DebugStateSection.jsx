import React from 'react';
import DebugIDSection from './sections/DebugIDSection';
import Debug3DSection from './sections/Debug3DSection';

const DebugStateSection = ({ debugData }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white/80">Current State</h3>
      <div className="bg-black/50 p-2 rounded space-y-4">
        <DebugIDSection id={debugData?.nodes?.focusedNodeId} />
        
        {debugData?.camera && (
          <Debug3DSection 
            camera={debugData.camera}
            rotation={debugData.rotation}
          />
        )}
        
        <div className="space-y-1">
          <p className="text-xs font-medium text-white/80">Focus</p>
          <div className="pl-2">
            <p className="text-xs">Focused Element: {debugData?.focusedElement?.label || 'None'}</p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-white/80">Project View</p>
          <div className="pl-2">
            <p className="text-xs">Canvas: {debugData?.currentView || 'Unknown'}</p>
            {debugData?.currentView === 'mindmap' && (
              <>
                <p className="text-xs pl-2">Perspective: {debugData?.viewMode || '2D'}</p>
              </>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-white/80">Canvas Nodes ({debugData.nodes?.list.length})</p>
          <div className="pl-2 space-y-2">
            {debugData.nodes?.list.map((node, index) => (
              <div key={node.id} className="text-xs space-y-1 border-l border-white/10 pl-2">
                <p className="font-medium">Node {index + 1}: {node.title || 'Untitled'}</p>
                <div className="pl-2 space-y-0.5">
                  <p className="font-mono">ID: {node.id}</p>
                  <p>Description: {node.description || 'No description'}</p>
                  <p>Data Type: {node.nodeType || 'generic'}</p>
                  <p>Style: {node.visualStyle || 'default'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugStateSection;
