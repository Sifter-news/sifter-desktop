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
          className="space-y-1"
          role="listbox"
          aria-label="Node list"
        >
          {nodes.map((node, index) => node && (
            <div 
              key={node.id}
              role="option"
              data-node-id={node.id}
              aria-selected={selectedNodes.includes(node.id)}
              tabIndex={focusedNodeId === node.id ? 0 : -1}
              className={`transition-all duration-200 ${
                focusedNodeId === node.id ? 'ring-2 ring-blue-300' : ''
              } ${selectedNodes.includes(node.id) ? 'ring-2 ring-blue-500' : ''}`}
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