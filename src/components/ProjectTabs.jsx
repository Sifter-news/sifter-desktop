import React from 'react';
import { Brain, Clock, Map } from 'lucide-react';
import MindMapView from './MindMapView';
import TimeView from './TimeView';
import MapView from './MapView';
import SidePanel from './SidePanel';

const ProjectTabs = ({ 
  project, 
  nodes, 
  setNodes, 
  onAddNode, 
  onUpdateNode, 
  onDeleteNode, 
  onAddReport, 
  onUpdateReport, 
  focusedNodeId,
  onNodeFocus 
}) => {
  const selectedNode = nodes.find(node => node.id === focusedNodeId);

  return (
    <div className="relative flex-grow">
      <SidePanel
        nodes={nodes}
        onUpdateNode={onUpdateNode}
        onNodeFocus={onNodeFocus}
        selectedNode={selectedNode}
        onAddNode={onAddNode}
      />
      
      <div className="w-full h-full">
        <MindMapView
          project={project}
          nodes={nodes}
          setNodes={setNodes}
          onAddNode={onAddNode}
          onUpdateNode={onUpdateNode}
          onDeleteNode={onDeleteNode}
          onAddReport={onAddReport}
          onUpdateReport={onUpdateReport}
          focusedNodeId={focusedNodeId}
          onNodeFocus={onNodeFocus}
        />
      </div>
    </div>
  );
};

export default ProjectTabs;