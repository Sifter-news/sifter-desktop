import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import NodeListItem from '../nodes/navigatorNodes/ListItem/NavigatorNodeListItem';

const NavigatorNodes = ({ nodes, onNodeSelect, selectedNodeId }) => {
  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-1 p-2">
        {nodes.map((node) => (
          <NodeListItem
            key={node.id}
            node={node}
            isSelected={selectedNodeId === node.id}
            onClick={() => onNodeSelect(node.id)}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default NavigatorNodes;