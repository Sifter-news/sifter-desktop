import React, { useState, useRef, useEffect } from 'react';

const NodeRenderer = ({ node, onDragStart, onConnectorDragStart, zoom, onNodeUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    if (isEditing && contentRef.current) {
      contentRef.current.focus();
    }
  }, [isEditing]);

  const handleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (onNodeUpdate) {
      onNodeUpdate(node.id, { text: contentRef.current.innerText });
    }
  };

  const renderNode = () => {
    switch (node.type) {
      case 'blank':
        return <div className="w-20 h-20 bg-white rounded-md shadow-md flex items-center justify-center">Node</div>;
      case 'postit':
        return (
          <div 
            className="w-64 h-64 bg-[#FFFFA5] rounded-md shadow-md flex flex-col p-4 relative overflow-hidden"
            onClick={handleClick}
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-[#FFF98F] rounded-t-md"></div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Source: {node.source || 'Untitled'}</h3>
            <div
              ref={contentRef}
              contentEditable={isEditing}
              onBlur={handleBlur}
              className="text-sm text-gray-700 overflow-y-auto flex-grow outline-none"
              suppressContentEditableWarning={true}
            >
              {node.text || 'Post-it content'}
            </div>
          </div>
        );
      case 'text':
        return (
          <div
            className="p-2 bg-white rounded shadow-md"
            onClick={handleClick}
          >
            <div
              ref={contentRef}
              contentEditable={isEditing}
              onBlur={handleBlur}
              className="outline-none"
              suppressContentEditableWarning={true}
            >
              {node.text}
            </div>
          </div>
        );
      case 'connector':
        return (
          <svg className="absolute" style={{ left: 0, top: 0, width: '100%', height: '100%' }}>
            <line
              x1={node.connectorStart.x}
              y1={node.connectorStart.y}
              x2={node.connectorEnd.x}
              y2={node.connectorEnd.y}
              stroke="black"
              strokeWidth="2"
            />
            <circle
              cx={node.connectorStart.x}
              cy={node.connectorStart.y}
              r="5"
              fill="red"
              onMouseDown={(e) => onConnectorDragStart(e, node.id, 'connectorStart')}
            />
            <circle
              cx={node.connectorEnd.x}
              cy={node.connectorEnd.y}
              r="5"
              fill="blue"
              onMouseDown={(e) => onConnectorDragStart(e, node.id, 'connectorEnd')}
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="absolute cursor-move"
      style={{ 
        left: `${node.x * zoom}px`, 
        top: `${node.y * zoom}px`,
        transform: `scale(${zoom})`,
        transformOrigin: 'top left'
      }}
      onMouseDown={(e) => onDragStart(e, node.id)}
    >
      {renderNode()}
    </div>
  );
};

export default NodeRenderer;