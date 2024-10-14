import React from 'react';
import { useDarkMode } from '../contexts/DarkModeContext';

const NodeRenderer = ({ node, onDragStart, onConnectorDragStart, zoom }) => {
  const { isDarkMode } = useDarkMode();

  const renderNode = () => {
    switch (node.type) {
      case 'blank':
        return <div className={`w-20 h-20 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'} rounded-md shadow-md flex items-center justify-center`}>Node</div>;
      case 'postit':
        return (
          <div className={`w-32 h-32 ${isDarkMode ? 'bg-yellow-600' : 'bg-yellow-200'} rounded-md shadow-md flex items-center justify-center relative`}>
            <div className={`absolute top-0 left-0 w-4 h-4 ${isDarkMode ? 'bg-yellow-700 hover:bg-yellow-800' : 'bg-yellow-300 hover:bg-yellow-400'} rounded-tl-md`}></div>
            <div className={`absolute top-0 right-0 w-4 h-4 ${isDarkMode ? 'bg-yellow-700 hover:bg-yellow-800' : 'bg-yellow-300 hover:bg-yellow-400'} rounded-tr-md`}></div>
            <div className={`absolute bottom-0 left-0 w-4 h-4 ${isDarkMode ? 'bg-yellow-700 hover:bg-yellow-800' : 'bg-yellow-300 hover:bg-yellow-400'} rounded-bl-md`}></div>
            <div className={`absolute bottom-0 right-0 w-4 h-4 ${isDarkMode ? 'bg-yellow-700 hover:bg-yellow-800' : 'bg-yellow-300 hover:bg-yellow-400'} rounded-br-md`}></div>
            <p className={`text-center p-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{node.text || 'Post-it'}</p>
          </div>
        );
      case 'text':
        return <div className={`p-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white'} rounded shadow-md`}>{node.text}</div>;
      case 'connector':
        return (
          <svg className="absolute" style={{ left: 0, top: 0, width: '100%', height: '100%' }}>
            <line
              x1={node.connectorStart.x}
              y1={node.connectorStart.y}
              x2={node.connectorEnd.x}
              y2={node.connectorEnd.y}
              stroke={isDarkMode ? 'white' : 'black'}
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