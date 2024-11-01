import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NodeNavigator from './text-view/NodeNavigator';
import FileTreeView from './text-view/FileTreeView';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebug } from '@/contexts/DebugContext';

const SidePanel = ({ 
  nodes, 
  onUpdateNode, 
  onNodeFocus, 
  selectedNode, 
  onAddNode 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { setHoveredElement } = useDebug();

  const handleTabMouseEnter = (tabName) => {
    setHoveredElement({
      component: `SidePanel:${tabName}Tab`,
      metadata: {
        type: 'Tab Content',
        isExpanded
      }
    });
  };

  const handleTabMouseLeave = () => {
    setHoveredElement(null);
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {isExpanded ? (
          <motion.div 
            className="fixed top-16 left-0 h-[calc(100vh-64px-8px)] bg-white shadow-lg z-50 w-[250px] rounded-xl mx-2 my-2"
            initial={{ x: -250 }}
            animate={{ x: 0 }}
            exit={{ x: -250 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Tabs defaultValue="nodes" className="w-full">
              <TabsList className="w-full rounded-t-xl">
                <TabsTrigger value="nodes" className="flex-1 rounded-tl-xl">Nodes</TabsTrigger>
                <TabsTrigger value="files" className="flex-1 rounded-tr-xl">Files</TabsTrigger>
              </TabsList>
              <TabsContent 
                value="nodes"
                onMouseEnter={() => handleTabMouseEnter('Nodes')}
                onMouseLeave={handleTabMouseLeave}
                data-component="SidePanel:NodesTab"
              >
                <NodeNavigator
                  nodes={nodes}
                  onUpdateNode={onUpdateNode}
                  onNodeFocus={onNodeFocus}
                  selectedNode={selectedNode}
                  onAddNode={onAddNode}
                />
              </TabsContent>
              <TabsContent 
                value="files" 
                className="p-4"
                onMouseEnter={() => handleTabMouseEnter('Files')}
                onMouseLeave={handleTabMouseLeave}
                data-component="SidePanel:FilesTab"
              >
                <FileTreeView
                  nodes={nodes}
                  onNodeSelect={onNodeFocus}
                  selectedNodeId={selectedNode?.id}
                />
              </TabsContent>
            </Tabs>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed top-20 left-0 z-50"
      >
        <Button
          variant="secondary"
          size="icon"
          className={`flex items-center justify-center w-8 h-8 rounded-xl shadow-lg bg-white hover:bg-gray-100 m-2 ${
            isExpanded ? 'ml-[258px]' : ''
          }`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </motion.div>
    </div>
  );
};

export default SidePanel;