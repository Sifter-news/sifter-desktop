import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from 'lucide-react';
import NodeListItem from '../nodes/navigatorNodes/ListItem/NavigatorNodeListItem';

const NavigatorContent = ({ type, nodes, onNodeSelect, selectedNodeId }) => {
  if (type === 'docs') {
    return (
      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="p-4 text-center text-gray-500">
          <FileText className="h-8 w-8 mx-auto mb-2" />
          <p>No documents uploaded yet</p>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-1 p-2">
        {nodes?.map((node) => (
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

export default NavigatorContent;