import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import NodeEditor from './NodeEditor';
import FocusedNodeTooltip from './FocusedNodeTooltip';

const NodeRenderer = ({ node, onDragStart, zoom, onNodeUpdate, onFocus, isFocused, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    onFocus(node.id);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const nodeStyle = node.type === 'postit' ? 'bg-yellow-200' : 'bg-white';

  return (
    <Rnd
      size={{ width: node.width || 200, height: node.height || 200 }}
      position={{ x: node.x, y: node.y }}
      onDragStart={(e) => onDragStart(e, node.id)}
      onDragStop={(e, d) => onNodeUpdate(node.id, { x: d.x, y: d.y })}
      onResize={(e, direction, ref, delta, position) => {
        onNodeUpdate(node.id, {
          width: ref.style.width,
          height: ref.style.height,
          ...position,
        });
      }}
      className={`cursor-move ${isFocused ? 'ring-2 ring-blue-500' : ''}`}
      onClick={handleClick}
    >
      <div className={`w-full h-full rounded-md shadow-md flex flex-col p-4 overflow-auto ${nodeStyle}`}>
        <NodeEditor
          node={node}
          onUpdate={onNodeUpdate}
          isEditing={isEditing}
          onBlur={handleBlur}
        />
      </div>
      {isFocused && (
        <FocusedNodeTooltip
          node={node}
          onUpdate={onNodeUpdate}
          onDelete={onDelete}
        />
      )}
    </Rnd>
  );
};

export default NodeRenderer;