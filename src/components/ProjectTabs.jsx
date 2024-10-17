import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, FileText, Clock, Map } from 'lucide-react';
import MindView from '../pages/project/MindView';
import TextView from '../pages/project/TextView';
import TimeView from '../pages/project/TimeView';
import MapView from '../pages/project/MapView';

const ProjectTabs = ({ project, nodes, setNodes, onAddNode, onUpdateNode, onDeleteNode }) => {
  return (
    <Tabs defaultValue="mind" className="w-full flex flex-col flex-grow">
      <TabsList className="max-w-[280px] mx-auto justify-center fixed top-16 left-0 right-0 bg-white bg-opacity-80 backdrop-blur-md z-10 inline-flex">
        <TabsTrigger value="mind" className="flex items-center">
          <Brain className="w-4 h-4 mr-2" />
          Mind
        </TabsTrigger>
        <TabsTrigger value="text" className="flex items-center">
          <FileText className="w-4 h-4 mr-2" />
          Text
        </TabsTrigger>
        <TabsTrigger value="time" className="flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          Time
        </TabsTrigger>
        <TabsTrigger value="map" className="flex items-center">
          <Map className="w-4 h-4 mr-2" />
          Map
        </TabsTrigger>
      </TabsList>
      <div className="flex-grow mt-12">
        <TabsContent value="mind" className="h-full">
          <MindView 
            project={project} 
            nodes={nodes}
            setNodes={setNodes}
            onAddNode={onAddNode}
            onUpdateNode={onUpdateNode}
            onDeleteNode={onDeleteNode}
          />
        </TabsContent>
        <TabsContent value="text" className="h-full">
          <TextView 
            project={project} 
            nodes={nodes}
            onAddNode={onAddNode}
            onUpdateNode={onUpdateNode}
            onDeleteNode={onDeleteNode}
          />
        </TabsContent>
        <TabsContent value="time" className="h-full">
          <TimeView 
            project={project} 
            nodes={nodes}
            onAddNode={onAddNode}
            onUpdateNode={onUpdateNode}
            onDeleteNode={onDeleteNode}
          />
        </TabsContent>
        <TabsContent value="map" className="h-full">
          <MapView 
            project={project} 
            nodes={nodes}
            onAddNode={onAddNode}
            onUpdateNode={onUpdateNode}
            onDeleteNode={onDeleteNode}
          />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default ProjectTabs;