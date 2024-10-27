import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
    <div 
      className={`fixed top-16 left-0 h-[calc(100vh-64px)] bg-white shadow-lg transition-all duration-300 z-50 ${
        isExpanded ? 'w-[250px]' : 'w-[48px]'
      }`}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 bg-white hover:bg-gray-100 rounded-full z-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>

      <div className={`mt-12 flex-grow overflow-hidden ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
        <NodeNavigator
          nodes={nodes}
          onUpdateNode={onUpdateNode}
          onNodeFocus={onNodeFocus}
          selectedNode={selectedNode}
          onAddNode={onAddNode}
        />
      </div>
    </div>
  );
};

export default SidePanel;