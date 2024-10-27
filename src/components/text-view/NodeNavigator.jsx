import React from 'react';
import { Button } from "@/components/ui/button";
import Navigator from '../Navigator';
import { findAvailablePosition } from '../../utils/canvasUtils';

const NodeNavigator = ({ nodes, onUpdateNode, onNodeFocus, selectedNode, onAddNode }) => {
  return (
    <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4">Node Navigator</h2>
      <Navigator 
        items={nodes} 
        setItems={onUpdateNode} 
        onDocumentClick={(node) => onNodeFocus(node.id)}
        focusedNode={selectedNode}
      />
      <Button onClick={() => {
        const position = findAvailablePosition(nodes);
        onAddNode({
          id: Date.now().toString(),
          type: 'text',
          title: `New Node ${nodes.length + 1}`,
          description: '',
          x: position.x,
          y: position.y
        });
      }} className="mt-4 w-full">Add Node</Button>
    </div>
  );
};

export default NodeNavigator;