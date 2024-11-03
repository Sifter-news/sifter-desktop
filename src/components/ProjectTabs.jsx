import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, Clock, Map, Pencil } from 'lucide-react';
import MindMapView from './MindMapView';
import TimeView from './TimeView';
import MapView from './MapView';
import { CanvasView } from '@/01_components/05_investigation/views';
import SidePanel from './SidePanel';
import { useDebug } from '@/contexts/DebugContext';
import Toolbar from '@/01_components/05_investigation/viewsControls/Toolbar';

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
  onNodeFocus,
  defaultView = 'canvas2d'
}) => {
  const selectedNode = nodes.find(node => node.id === focusedNodeId);
  const { setDebugData } = useDebug();
  const [activeTool, setActiveTool] = useState('select');
  const [currentView, setCurrentView] = useState(defaultView);
  const [showAIChat, setShowAIChat] = useState(false);

  useEffect(() => {
    setDebugData(prev => ({
      ...prev,
      currentView: defaultView
    }));
  }, [defaultView, setDebugData]);

  const handleViewChange = (view) => {
    setCurrentView(view);
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
      
      <Tabs defaultValue={defaultView} className="w-full h-full" onValueChange={handleViewChange}>
        <div className="flex justify-center">
          <TabsList className="mx-auto bg-white bg-opacity-80 backdrop-blur-md z-10 fixed top-16">
            <TabsTrigger value="canvas2d" className="flex items-center">
              <Pencil className="w-4 h-4 mr-2" />
              Canvas
            </TabsTrigger>
            <TabsTrigger value="mindmap" className="flex items-center">
              <Brain className="w-4 h-4 mr-2" />
              Mind
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Time
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center">
              <Map className="w-4 h-4 mr-2" />
              Map
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50">
          <Toolbar 
            viewMode={currentView}
            onViewModeChange={handleViewChange}
            onAIChatToggle={() => setShowAIChat(!showAIChat)}
            onAddNode={onAddNode}
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            showViewToggle={currentView !== 'canvas2d'}
          />
        </div>

        <div className="flex-grow mt-12">
          <TabsContent value="canvas2d" className="h-[calc(100vh-128px)]">
            <CanvasView
              project={project}
              nodes={nodes}
              setNodes={setNodes}
              onAddNode={onAddNode}
              onUpdateNode={onUpdateNode}
              onDeleteNode={onDeleteNode}
              focusedNodeId={focusedNodeId}
              onNodeFocus={onNodeFocus}
              activeTool={activeTool}
              setActiveTool={setActiveTool}
            />
          </TabsContent>
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
