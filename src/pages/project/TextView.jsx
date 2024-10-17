import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Navigator from './Navigator';
import { findAvailablePosition } from '../utils/canvasUtils';

const TextView = ({ project, nodes, onAddNode, onUpdateNode, onDeleteNode }) => {
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (nodes.length > 0 && !selectedNode) {
      setSelectedNode(nodes[0]);
    }
  }, [nodes, selectedNode]);

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  const handleContentChange = (e) => {
    const updatedNode = { ...selectedNode, content: e.target.value };
    setSelectedNode(updatedNode);
    onUpdateNode(updatedNode);
  };

  const handleDelete = () => {
    if (selectedNode) {
      onDeleteNode(selectedNode.id);
      setSelectedNode(null);
    }
  };

  const handleShare = () => {
    console.log('Share node');
    // Implement share functionality here
  };

  const handleMove = () => {
    console.log('Move node');
    // Implement move functionality here
  };

  const handleAddNode = () => {
    const position = findAvailablePosition(nodes);
    const newNode = {
      id: Date.now().toString(),
      type: 'node',
      title: `New Node ${nodes.filter(node => node.type === 'node').length + 1}`,
      content: '',
      x: position.x,
      y: position.y,
      width: 200,
      height: 200,
    };
    onAddNode(newNode);
  };

  return (
    <div className="flex h-full">
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <Navigator 
          items={nodes} 
          setItems={onUpdateNode} 
          onNodeClick={handleNodeClick}
          focusedNode={selectedNode}
        />
        <Button onClick={handleAddNode} className="mt-4 w-full">Add Node</Button>
      </div>
      <div className="flex-grow flex flex-col p-8 overflow-hidden">
        {selectedNode ? (
          <div className="bg-white bg-opacity-80 shadow-lg rounded-lg p-6 relative flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-4">{selectedNode.title}</h2>
            <textarea
              value={selectedNode.content}
              onChange={handleContentChange}
              className="flex-grow w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute top-2 right-2">
              <Button variant="ghost" size="sm" onClick={handleDelete}>Delete</Button>
              <Button variant="ghost" size="sm" onClick={handleShare}>Share</Button>
              <Button variant="ghost" size="sm" onClick={handleMove}>Move</Button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            Select a node from the navigator to view its content.
          </div>
        )}
      </div>
    </div>
  );
};

export default TextView;