import React from 'react';
import DebugIDSection from './DebugIDSection';
import Debug3DSection from './Debug3DSection';
import { Eye } from 'lucide-react';

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
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-blue-400" />
            <p className="text-xs font-medium text-white/80">View Status</p>
          </div>
          <div className="pl-2">
            <p className="text-xs">Canvas: {debugData?.currentView || 'Unknown'}</p>
            {debugData?.currentView === 'mindmap' && (
              <p className="text-xs pl-2">Perspective: {debugData?.viewMode || '2D'}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugStateSection;