import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NavigatorContent from './NavigatorContent';

const NavigatorOut = ({ children }) => {
  return (
    <div className="w-full h-full bg-white/10 backdrop-blur-sm m-4 rounded-2xl">
      {children}
    </div>
  );
};

const Navigator = ({ nodes, onNodeSelect, selectedNodeId }) => {
  return (
    <NavigatorOut>
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
    </NavigatorOut>
  );
};

export default Navigator;