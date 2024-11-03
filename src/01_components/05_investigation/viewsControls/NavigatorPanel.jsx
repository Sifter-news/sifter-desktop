import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NavigatorNodes from './Navigator/NavigatorNodes';
import NavigatorDocs from './Navigator/NavigatorDocs';

const NavigatorPanel = ({ 
  nodes, 
  documents, 
  selectedNodeId, 
  selectedDocId,
  onNodeSelect,
  onDocumentSelect 
}) => {
  return (
    <div className="w-full h-full bg-white/10 backdrop-blur-sm -mt-1 p-2">
      <Tabs defaultValue="nodes" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="nodes">Nodes</TabsTrigger>
          <TabsTrigger value="docs">Documents</TabsTrigger>
        </TabsList>
        <TabsContent value="nodes">
          <NavigatorNodes 
            nodes={nodes} 
            onNodeSelect={onNodeSelect}
            selectedNodeId={selectedNodeId}
          />
        </TabsContent>
        <TabsContent value="docs">
          <NavigatorDocs 
            documents={documents}
            onDocumentSelect={onDocumentSelect}
            selectedDocId={selectedDocId}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NavigatorPanel;