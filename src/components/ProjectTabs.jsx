import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Clock, Map } from 'lucide-react';
import MindMapView from './MindMapView';
import TimeView from './TimeView';
import MapView from './MapView';
import SidePanel from './SidePanel';
import { useDebug } from '@/contexts/DebugContext';

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
  const { setDebugData } = useDebug();

  const handleViewChange = (view) => {
    setDebugData(prev => ({
      ...prev,
      currentView: view
    }));
  };

  return (
    <div className="relative flex-grow">
      <SidePanel
        nodes={nodes}
        onUpdateNode={onUpdateNode}
        onNodeFocus={onNodeFocus}
        selectedNode={selectedNode}
        onAddNode={onAddNode}
      />
      
      <Tabs defaultValue="mindmap" className="w-full h-full" onValueChange={handleViewChange}>
        <div className="flex justify-center">
          <TabsList className="mx-auto bg-white bg-opacity-80 backdrop-blur-md z-10 fixed top-16">
            <TabsTrigger value="mindmap" className="flex items-center">
              <Brain className="w-4 h-4 mr-2" />
              Mind Map
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center">
              <Map className="w-4 h-4 mr-2" />
              Map
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="flex-grow mt-12">
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
            <TimeView 
              nodes={nodes} 
              focusedNodeId={focusedNodeId}
              onNodeFocus={onNodeFocus}
              onUpdateNode={onUpdateNode}
              onAddNode={onAddNode}
            />
          </TabsContent>
          <TabsContent value="map">
            <MapView 
              nodes={nodes} 
              focusedNodeId={focusedNodeId}
              onNodeFocus={onNodeFocus}
              onUpdateNode={onUpdateNode}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ProjectTabs;