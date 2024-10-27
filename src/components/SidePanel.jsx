import React, { useState } from 'react';
import { CircleIcon, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NodeNavigator from './text-view/NodeNavigator';

const SidePanel = ({ 
  nodes, 
  onUpdateNode, 
  onNodeFocus, 
  selectedNode, 
  onAddNode 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <>
      {isExpanded ? (
        <div className="fixed top-16 left-0 h-[calc(100vh-64px)] bg-white shadow-lg transition-all duration-300 z-50 w-[250px]">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white hover:bg-gray-100 rounded-full z-50"
            onClick={() => setIsExpanded(false)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="mt-12 flex-grow overflow-hidden">
            <NodeNavigator
              nodes={nodes}
              onUpdateNode={onUpdateNode}
              onNodeFocus={onNodeFocus}
              selectedNode={selectedNode}
              onAddNode={onAddNode}
            />
          </div>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-20 left-4 bg-white shadow-lg hover:bg-gray-100 rounded-full z-50 w-10 h-10"
          onClick={() => setIsExpanded(true)}
        >
          <CircleIcon className="h-6 w-6" />
        </Button>
      )}
    </>
  );
};

export default SidePanel;