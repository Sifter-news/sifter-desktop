import React from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
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
  const handleKeyDown = (e, node, index) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleNodeClick(node.id);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (index > 0) {
          onNodeFocus(nodes[index - 1].id);
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (index < nodes.length - 1) {
          onNodeFocus(nodes[index + 1].id);
        }
        break;
      default:
        break;
    }
  };

  const onDragEnd = (result) => {
    // Handle drag end if needed
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="node-list">
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
                onKeyDown={(e) => handleKeyDown(e, node, index)}
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
    </DragDropContext>
  );
};

export default NodeList;