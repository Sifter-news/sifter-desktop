import React from 'react';
import DebugIDSection from '../DebugIDSection';
import Debug3DSection from '../Debug3DSection';
import { Eye, Target, CheckSquare } from 'lucide-react';

const DebugStateSection = ({ debugData }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-white/80">Current State</h3>
      <div className="bg-black/50 p-2 rounded space-y-4">
        <DebugIDSection id={debugData?.nodes?.focusedNodeId} />
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-400" />
            <p className="text-xs font-medium text-white/80">Focus State</p>
          </div>
          <div className="pl-2 space-y-1">
            <p className="text-xs">Focused Node ID: <span className="text-blue-400">{debugData?.nodes?.focusedNodeId || 'None'}</span></p>
            <p className="text-xs">Last Focus Time: <span className="text-blue-400">{debugData?.nodes?.lastFocusTime ? new Date(debugData.nodes.lastFocusTime).toLocaleTimeString() : 'N/A'}</span></p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-green-400" />
            <p className="text-xs font-medium text-white/80">Selection State</p>
          </div>
          <div className="pl-2 space-y-1">
            <p className="text-xs">Selected Nodes: <span className="text-green-400">{debugData?.nodes?.selectedNodes?.length || 0}</span></p>
            <div className="text-xs space-y-0.5">
              {debugData?.nodes?.selectedNodes?.map((nodeId, index) => (
                <p key={nodeId}>{index + 1}. <span className="text-green-400">{nodeId}</span></p>
              ))}
            </div>
          </div>
        </div>

        {debugData?.camera && (
          <Debug3DSection 
            camera={debugData.camera}
            rotation={debugData.rotation}
          />
        )}
        
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

        <div className="space-y-1">
          <p className="text-xs font-medium text-white/80">Canvas Nodes ({debugData.nodes?.list.length || 0})</p>
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