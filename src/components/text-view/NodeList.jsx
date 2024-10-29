import React from 'react';
import { Droppable } from 'react-beautiful-dnd';
import NodeListItem from './NodeListItem';

const NodeList = ({ 
  nodes, 
  onNodeFocus, 
  selectedNodes, 
  handleNodeClick, 
  onUpdateNode, 
  onAIConversation, 
  focusedNodeId, 
  onDeleteNode 
}) => {
  return (
    <Droppable droppableId="root" type="node">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="space-y-1" // Changed from space-y-0 to space-y-1 for minimal spacing
        >
          {nodes.map((node, index) => node && (
            <div 
              key={node.id}
              onMouseEnter={() => onNodeFocus(node.id)}
              onMouseLeave={() => onNodeFocus(null)}
              className={`transition-all duration-200 ${
                focusedNodeId === node.id ? 'ring-2 ring-blue-500 rounded-lg' : ''
              }`}
            >
              <NodeListItem
                node={node}
                index={index}
                isSelected={selectedNodes.includes(node.id)}
                onSelect={handleNodeClick}
                onFocus={onNodeFocus}
                onUpdateNode={onUpdateNode}
                onAIConversation={onAIConversation}
                isFocused={focusedNodeId === node.id}
                onDelete={onDeleteNode}
              />
            </div>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default NodeList;