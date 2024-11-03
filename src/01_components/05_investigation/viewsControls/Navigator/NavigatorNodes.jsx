import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import NavigatorNodeListItem from './NavigatorNodeListItem';

const NavigatorNodes = ({ nodes, onNodeSelect, selectedNodeId }) => {
  const handleNodeClick = (nodeId) => {
    onNodeSelect(nodeId);
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        {nodes?.map((node) => (
          <NavigatorNodeListItem
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            onClick={() => handleNodeClick(node.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default NavigatorNodes;