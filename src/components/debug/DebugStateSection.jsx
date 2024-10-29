import React from 'react';
import { NODE_STYLES } from '@/utils/nodeStyles';

const DebugStateSection = ({ debugData }) => {
  const getToolInstructions = (tool) => {
    switch (tool) {
      case 'pan':
        return (
          <div className="space-y-1 text-xs">
            <p className="font-medium">Left Click + Drag:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Pans the canvas in X and Y directions</li>
              <li>Cursor changes to "grabbing" while dragging</li>
              <li>Snaps to single axis if movement is predominantly horizontal or vertical</li>
            </ul>
            
            <p className="font-medium mt-2">Right Click + Drag:</p>
            <ul className="list-disc pl-4">
              <li>Currently not implemented</li>
            </ul>
            
            <p className="font-medium mt-2">Other Controls:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Mouse wheel: Zooms in/out</li>
              <li>Ctrl/Cmd + Mouse wheel: Also zooms in/out</li>
              <li>Ctrl/Cmd + '+': Zoom in</li>
              <li>Ctrl/Cmd + '-': Zoom out</li>
            </ul>
          </div>
        );
      case 'select':
        return (
          <div className="space-y-1 text-xs">
            <p className="font-medium">Left Click:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Select a single node</li>
              <li>Click and drag to move selected node</li>
            </ul>
            
            <p className="font-medium mt-2">Other Controls:</p>
            <ul className="list-disc pl-4 space-y-0.5">
              <li>Space bar: Temporarily switches to pan tool while held down</li>
              <li>Delete/Backspace: Delete selected node</li>
              <li>Ctrl/Cmd + C: Copy selected node</li>
              <li>Ctrl/Cmd + V: Paste copied node</li>
            </ul>
          </div>
        );
      default:
        return null;
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

  const getFocusedElement = () => {
    if (debugData?.focusedNodeId) {
      const node = debugData?.nodes?.list?.find(n => n.id === debugData.focusedNodeId);
      return `Node: ${node?.title || node?.id || 'Unknown Node'}`;
    }
    
    if (debugData?.focusedElement?.type) {
      return `${debugData.focusedElement.type}: ${debugData.focusedElement.label || 'Unnamed'}`;
    }

    return 'None';
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-white/80">Current State</h3>
      <div className="bg-black/50 p-2 rounded space-y-2">
        <div className="space-y-1">
          <p className="text-xs font-medium text-white/80">Active Tool: {debugData?.activeTool || 'None'}</p>
          {getToolInstructions(debugData?.activeTool)}
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-white/80">Focus</p>
          <div className="pl-2">
            <p className="text-xs">Focused Element: {getFocusedElement()}</p>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-white/80">Project View</p>
          <div className="pl-2">
            <p className="text-xs">Canvas: {getCurrentView()}</p>
          </div>
        </div>

        {debugData?.nodes?.list && debugData.nodes.list.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-white/80">Canvas Nodes ({debugData.nodes.list.length})</p>
            <div className="pl-2 space-y-2">
              {debugData.nodes.list.map((node, index) => (
                <div key={node.id} className="text-xs space-y-1 border-l border-white/10 pl-2">
                  <p className="font-medium">Node {index + 1}: {node.title || 'Untitled'}</p>
                  <div className="pl-2 space-y-0.5">
                    <p className="font-mono">ID: {node.id}</p>
                    <p>Description: {node.description || 'No description'}</p>
                    <p>Data Type: {getNodeDataType(node.nodeType)}</p>
                    <p>Style: {node.visualStyle || 'default'}</p>
                    {getNodeStyleProperties(node)}
                    <div className="font-mono">
                      Position: (
                      <span className="text-red-400">{node.position?.x || '0'}</span>, 
                      <span className="text-green-400">{node.position?.y || '0'}</span>, 
                      <span className="text-blue-400">{node.position?.z || '0'}</span>)
                    </div>
                    <p>Width: {node.width || '200'}</p>
                    <p>Height: {node.height || '100'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugStateSection;
