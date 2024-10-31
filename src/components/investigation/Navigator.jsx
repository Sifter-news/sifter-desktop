import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NavigatorContent from './NavigatorContent';

const Navigator = ({ nodes, onNodeSelect, selectedNodeId }) => {
  return (
    <Tabs defaultValue="nodes" className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="nodes">Nodes</TabsTrigger>
        <TabsTrigger value="docs">Documents</TabsTrigger>
      </TabsList>
      <TabsContent value="nodes">
        <NavigatorContent 
          type="nodes"
          nodes={nodes} 
          onNodeSelect={onNodeSelect}
          selectedNodeId={selectedNodeId}
        />
      </TabsContent>
      <TabsContent value="docs">
        <NavigatorContent type="docs" />
      </TabsContent>
    </Tabs>
  );
};

export default Navigator;