import React from 'react';
import { Button } from "@/components/ui/button";
import Navigator from '../Navigator';

const NodeNavigator = ({ nodes, onUpdateNode, onNodeFocus, selectedNode, onAddNode }) => {
  const handleAddNode = () => {
    // Calculate position internally instead of passing the function
    const position = {
      x: Math.random() * 500,  // Simple positioning logic
      y: Math.random() * 500
    };

    onAddNode({
      id: Date.now().toString(),
      type: 'text',
      title: `New Node ${nodes.length + 1}`,
      description: '',
      x: position.x,
      y: position.y
    });
  };

  return (
    <div className="w-full h-full flex flex-col p-4">
      <h2 className="text-lg font-semibold mb-4">Node Navigator</h2>
      <div className="flex-grow overflow-y-auto">
        <Navigator 
          items={nodes} 
          setItems={onUpdateNode} 
          onDocumentClick={(node) => onNodeFocus(node.id)}
          focusedNode={selectedNode}
        />
      </div>
      <Button onClick={handleAddNode} className="mt-4 w-full">Add Node</Button>
    </div>
  );
};

export default NodeNavigator;