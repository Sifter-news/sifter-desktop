import React, { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import FocusedNodeTooltip from './FocusedNodeTooltip';

const NodeRenderer = ({ node, onDragStart, onConnectorDragStart, zoom, onNodeUpdate, onFocus, isFocused, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.focus();
    }
  }, [isEditing]);

  const handleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    onFocus(node.id);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (onNodeUpdate) {
      onNodeUpdate(node.id, { 
        text: contentRef.current ? contentRef.current.innerText : '',
        source: titleRef.current ? titleRef.current.innerText : ''
      });
    }
  };

  const renderNodeContent = () => {
    switch (node.type) {
      case 'postit':
        return (
          <div className={`w-full h-full bg-[${node.color || '#FFFFA5'}] rounded-md shadow-md flex flex-col p-4 relative overflow-hidden`}>
            <div className="absolute top-0 left-0 w-full h-2 bg-[#FFF98F] rounded-t-md"></div>
            <h3 
              ref={titleRef}
              contentEditable={isEditing}
              onBlur={handleBlur}
              className="text-lg font-semibold mb-2 text-gray-800 outline-none"
              suppressContentEditableWarning={true}
            >
              {node.source || ''}
            </h3>
            <div
              ref={contentRef}
              contentEditable={isEditing}
              onBlur={handleBlur}
              className={`text-sm text-gray-700 overflow-y-auto flex-grow outline-none ${node.textSize || 'text-base'}`}
              suppressContentEditableWarning={true}
            >
              {node.text || ''}
            </div>
          </div>
        );
      case 'blank':
        return <div className="w-full h-full bg-white rounded-md shadow-md flex items-center justify-center">Node</div>;
      case 'text':
        return (
          <div
            ref={contentRef}
            contentEditable={isEditing}
            onBlur={handleBlur}
            className="w-full h-full p-2 bg-white rounded shadow-md outline-none"
            suppressContentEditableWarning={true}
          >
            {node.text || ''}
          </div>
        );
      case 'ai':
        return (
          <div className="w-full h-full bg-blue-100 rounded-md shadow-md flex items-center justify-center p-2">
            <span className="text-blue-600 font-semibold">AI Node</span>
          </div>
        );
      default:
        return null;
    }
  };

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
      {renderNodeContent()}
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
