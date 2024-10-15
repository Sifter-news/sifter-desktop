import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Navigator from './Navigator';
import { Node } from '../types/nodeTypes';

const TextView = ({ project, nodes, setNodes }) => {
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    if (nodes.length > 0) {
      setSelectedNode(nodes[0]);
    }
  }, [nodes]);

  const handleNodeClick = (node) => {
    setSelectedNode(node);
  };

  const handleContentChange = (e) => {
    const updatedNode = { ...selectedNode, description: e.target.value };
    setSelectedNode(updatedNode);
    setNodes(prevNodes => prevNodes.map(node => 
      node.id === updatedNode.id ? updatedNode : node
    ));
  };

  const handleDelete = () => {
    if (selectedNode) {
      setNodes(prevNodes => prevNodes.filter(node => node.id !== selectedNode.id));
      setSelectedNode(null);
    }
  };

  const handleAddNode = (type: 'node' | 'group') => {
    const newNode: Node = {
      id: Date.now().toString(),
      type,
      title: type === 'group' ? 'New Group' : 'New Node',
      description: '',
      timestamp: Date.now(),
      children: type === 'group' ? [] : undefined,
    };
    setNodes([...nodes, newNode]);
  };

  return (
    <div className="flex h-full">
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <Navigator 
          nodes={nodes} 
          setNodes={setNodes} 
          onNodeClick={handleNodeClick}
          selectedNode={selectedNode}
        />
      </div>
      <div className="flex-grow flex flex-col p-8 overflow-hidden">
        {selectedNode ? (
          <div className="bg-white bg-opacity-80 shadow-lg rounded-lg p-6 relative flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-4">{selectedNode.title}</h2>
            <textarea
              value={selectedNode.description}
              onChange={handleContentChange}
              className="flex-grow w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute top-2 right-2">
              <Button variant="ghost" size="sm" onClick={handleDelete}>Delete</Button>
              <Button variant="ghost" size="sm" onClick={() => handleAddNode('node')}>Add Node</Button>
              <Button variant="ghost" size="sm" onClick={() => handleAddNode('group')}>Add Group</Button>
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