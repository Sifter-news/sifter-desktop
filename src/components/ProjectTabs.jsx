import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, FileText, Clock, Map } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MindView from '../pages/project/MindView';
import TextView from '../pages/project/TextView';
import TimeView from '../pages/project/TimeView';
import MapView from '../pages/project/MapView';

const ProjectTabs = ({ project, nodes, setNodes, onAddNode, onUpdateNode, onDeleteNode }) => {
  const [question, setQuestion] = useState('');

  const handleAsk = () => {
    // Implement the ask functionality here
    console.log("Asked:", question);
    // Reset the input after asking
    setQuestion('');
  };

  return (
    <Tabs defaultValue="mind" className="w-full flex flex-col flex-grow">
      <div className="fixed top-16 left-0 right-0 z-10 bg-white bg-opacity-80 backdrop-blur-md">
        <TabsList className="mx-auto justify-center inline-flex rounded-full px-1 py-1">
          <TabsTrigger value="mind" className="flex items-center px-4 py-2">
            <Brain className="w-4 h-4 mr-2" />
            Mind
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center px-4 py-2">
            <FileText className="w-4 h-4 mr-2" />
            Text
          </TabsTrigger>
          <TabsTrigger value="time" className="flex items-center px-4 py-2">
            <Clock className="w-4 h-4 mr-2" />
            Time
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center px-4 py-2">
            <Map className="w-4 h-4 mr-2" />
            Map
          </TabsTrigger>
        </TabsList>
        <div className="flex justify-center mt-2 pb-2">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Ask anything..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
            />
            <Button onClick={handleAsk}>Ask</Button>
          </div>
        </div>
      </div>
      <div className="flex-grow mt-32">
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