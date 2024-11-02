/**
 * @file NavigatorNodes.jsx
 * @description Tab and panel for navigating node-based data within an investigation
 */

import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

const NavigatorNodes = ({ nodes, onNodeSelect, selectedNodeId }) => {
  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        {nodes.map(node => (
          <div
            key={node.id}
            className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
              selectedNodeId === node.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => onNodeSelect(node.id)}
          >
            <h3 className="font-medium">{node.title}</h3>
            {node.description && (
              <p className="text-sm text-gray-500">{node.description}</p>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default NavigatorNodes;