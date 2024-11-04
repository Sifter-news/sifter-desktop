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
            connection.isAnchored ? 'stroke-blue-400' : 'stroke-gray-300'
          }`}
          strokeWidth={connection.isAnchored ? 2 : 1.5}
          strokeOpacity={0.6}
          isDashed={!connection.sourceNodeId || !connection.targetNodeId}
        />
      ))}

      {activeConnection && (
        <ConnectorLine
          startX={activeConnection.startX}
          startY={activeConnection.startY}
          endX={activeConnection.endX}
          endY={activeConnection.endY}
          isDashed={true}
          className="stroke-blue-400"
          strokeOpacity={0.5}
        />
      )}
    </>
  );
};

export default ConnectionLines;