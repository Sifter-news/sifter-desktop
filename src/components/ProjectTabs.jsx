import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, FileText, Clock, Map } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MindMapView from './MindMapView';
import TextView from './TextView';
import TimeView from './TimeView';
import MapView from './MapView';
import ReportList from './ReportList';

const ProjectTabs = ({ 
  project, 
  nodes, 
  setNodes, 
  onAddNode, 
  onUpdateNode, 
  onDeleteNode,
  onAddReport,
  onUpdateReport,
  onDeleteReport 
}) => {
  const [investigatorType, setInvestigatorType] = useState('private');

  return (
    <div className="relative h-full">
      <div className="fixed top-20 right-4 z-50">
        <Select value={investigatorType} onValueChange={setInvestigatorType}>
          <SelectTrigger className="w-[180px] bg-white bg-opacity-80 backdrop-blur-md shadow-lg">
            <SelectValue placeholder="Select investigator type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="private">Private Investigator</SelectItem>
            <SelectItem value="police">Police Detective</SelectItem>
            <SelectItem value="journalist">Investigative Journalist</SelectItem>
            <SelectItem value="corporate">Corporate Investigator</SelectItem>
            <SelectItem value="cyber">Cyber Investigator</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
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
            <MindMapView 
              project={project} 
              nodes={nodes}
              setNodes={setNodes}
              onAddNode={onAddNode}
              onUpdateNode={onUpdateNode}
              onDeleteNode={onDeleteNode}
              investigatorType={investigatorType}
            />
          </TabsContent>
          <TabsContent value="text" className="h-full">
            <TextView 
              project={project} 
              nodes={nodes}
              onAddNode={onAddNode}
              onUpdateNode={onUpdateNode}
              onDeleteNode={onDeleteNode}
              investigatorType={investigatorType}
            />
          </TabsContent>
          <TabsContent value="time" className="h-full">
            <TimeView 
              project={project} 
              nodes={nodes}
              onAddNode={onAddNode}
              onUpdateNode={onUpdateNode}
              onDeleteNode={onDeleteNode}
              investigatorType={investigatorType}
            />
          </TabsContent>
          <TabsContent value="map" className="h-full">
            <MapView 
              project={project} 
              nodes={nodes}
              onAddNode={onAddNode}
              onUpdateNode={onUpdateNode}
              onDeleteNode={onDeleteNode}
              investigatorType={investigatorType}
            />
          </TabsContent>
        </div>
      </Tabs>
      
      <div className="fixed bottom-12 right-12 z-50">
        <ReportList
          reports={project.reports}
          onAddReport={onAddReport}
          onEditReport={onUpdateReport}
          onDeleteReport={onDeleteReport}
        />
      </div>
    </div>
  );
};

export default ProjectTabs;