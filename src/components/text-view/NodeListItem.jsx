import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import NodeActions from './NodeActions';
import { getNodeTypeIcon } from './NodeTypeIcon';

const NodeListItem = ({ node, isSelected, onSelect, onFocus, onUpdateNode, onAIConversation }) => {
  if (!node) return null;

  return (
    <div 
      className={`group flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg ${
        isSelected ? 'bg-blue-50 ring-2 ring-blue-500' : ''
      }`}
      onClick={() => onSelect(node.id)}
    >
      <div 
        className="flex items-center flex-grow cursor-pointer gap-3"
        onClick={(e) => {
          e.stopPropagation();
          onFocus(node.id);
        }}
      >
        <Avatar className="h-8 w-8">
          <AvatarImage src="/default-image.png" alt={node.title} />
          <AvatarFallback>{getNodeTypeIcon(node.nodeType)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium text-sm">{node.title}</div>
          <div className="text-sm text-gray-500">
            {node.description}
            {node.type === 'group' && node.children && ` (${node.children.length} nodes)`}
          </div>
        </div>
      </div>
      <NodeActions 
        node={node} 
        onUpdateNode={onUpdateNode}
        onAIConversation={onAIConversation}
      />
    </div>
  );
};

export default NodeListItem;