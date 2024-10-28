import React from 'react';
import { FolderIcon, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const FolderItem = ({ folder, nodes, onNodeSelect, focusedNodeId }) => {
  return (
    <Collapsible className="w-full">
      <CollapsibleTrigger className="flex items-center w-full p-2 hover:bg-gray-100 rounded-lg gap-2">
        <FolderIcon className="h-4 w-4" />
        <span className="flex-grow text-left">{folder.title}</span>
        <span className="text-sm text-gray-500">{nodes.length}</span>
        <ChevronDown className="h-4 w-4" />
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-6">
        {nodes.map(node => (
          <div
            key={node.id}
            onClick={() => onNodeSelect(node.id)}
            className={`p-2 cursor-pointer hover:bg-gray-100 rounded-lg ${
              focusedNodeId === node.id ? 'bg-blue-50 ring-2 ring-blue-500' : ''
            }`}
          >
            {node.title}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default FolderItem;