import React, { useState, useEffect } from 'react';
import SearchInput from './SearchInput';
import NodeActions from './NodeActions';

const NodeNavigator = ({ 
  nodes, 
  onUpdateNode, 
  onNodeFocus, 
  selectedNode, 
  onAddNode,
  onAIConversation 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [navigatorNodes, setNavigatorNodes] = useState(nodes);

  useEffect(() => {
    setNavigatorNodes(nodes);
  }, [nodes]);

  const handleNodeUpdate = (updatedNodes) => {
    setNavigatorNodes(updatedNodes);
    onUpdateNode(updatedNodes);
  };

  const filteredNodes = navigatorNodes.filter(node => {
    return node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           node.description?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="space-y-4 mb-4">
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="flex-grow overflow-y-auto">
        {filteredNodes.map(node => (
          <div key={node.id} className="group flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg">
            <div 
              className="flex-grow cursor-pointer"
              onClick={() => onNodeFocus(node.id)}
            >
              <div className="font-medium">{node.title}</div>
              <div className="text-sm text-gray-500">{node.description}</div>
            </div>
            <NodeActions 
              node={node} 
              onUpdateNode={onUpdateNode}
              onAIConversation={onAIConversation}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default NodeNavigator;