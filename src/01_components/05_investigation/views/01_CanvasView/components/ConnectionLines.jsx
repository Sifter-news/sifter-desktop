import React from 'react';
import ConnectorLine from '@/components/node/ConnectorLine';

const ConnectionLines = ({ 
  connections, 
  activeConnection, 
  onSelectConnection,
  selectedConnectionId 
}) => {
  return (
    <>
      {/* Render existing connections */}
      {connections.map((connection) => (
        <ConnectorLine
          key={connection.id}
          startX={connection.startX}
          startY={connection.startY}
          endX={connection.endX}
          endY={connection.endY}
          isSelected={selectedConnectionId === connection.id}
          onClick={() => onSelectConnection(connection)}
          className={`cursor-pointer hover:stroke-blue-500 ${
            connection.type === 'hierarchical' ? 'stroke-gray-400' : 'stroke-gray-300'
          }`}
          strokeWidth={connection.type === 'hierarchical' ? 2 : 1.5}
          strokeOpacity={connection.type === 'hierarchical' ? 0.6 : 0.4}
        />
      ))}

      {/* Render active connection being drawn */}
      {activeConnection && (
        <ConnectorLine
          startX={activeConnection.startX}
          startY={activeConnection.startY}
          endX={activeConnection.endX}
          endY={activeConnection.endY}
          isDashed
          className="stroke-blue-400"
          strokeOpacity={0.5}
        />
      )}
    </>
  );
};

export default ConnectionLines;