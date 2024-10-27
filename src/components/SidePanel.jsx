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
      className={`fixed top-16 left-0 h-[calc(100vh-64px)] bg-white shadow-lg transition-all duration-300 z-50 flex ${
        isExpanded ? 'w-[250px]' : 'w-[48px]'
      }`}
    >
      <div className={`flex-grow overflow-hidden ${isExpanded ? 'opacity-100' : 'opacity-0 w-0'}`}>
        <NodeNavigator
          nodes={nodes}
          onUpdateNode={onUpdateNode}
          onNodeFocus={onNodeFocus}
          selectedNode={selectedNode}
          onAddNode={onAddNode}
        />
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-full z-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </Button>
    </div>
  );
};

export default SidePanel;