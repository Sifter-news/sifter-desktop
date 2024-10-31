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
  const handleKeyDown = (e, node) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleNodeClick(node.id);
    }
  };

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
              aria-selected={selectedNodes.includes(node.id)}
              tabIndex={0}
              onKeyDown={(e) => handleKeyDown(e, node)}
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