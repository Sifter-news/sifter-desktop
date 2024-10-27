import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
      
      <Tabs defaultValue="mindmap" className="w-full h-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mindmap">Mind Map</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
        </TabsList>
        <TabsContent value="mindmap" className="h-[calc(100vh-128px)]">
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
        </TabsContent>
        <TabsContent value="timeline">
          <TimeView nodes={nodes} />
        </TabsContent>
        <TabsContent value="map">
          <MapView nodes={nodes} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectTabs;