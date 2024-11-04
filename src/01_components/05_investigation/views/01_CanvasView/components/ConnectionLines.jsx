import React from 'react';
import ConnectorLine from '@/components/node/ConnectorLine';

const ConnectionLines = ({ connections, activeConnection }) => {
  return (
    <>
      {connections.map((connection, index) => (
        <ConnectorLine
          key={`connection-${index}`}
          startX={connection.startX}
          startY={connection.startY}
          endX={connection.endX}
          endY={connection.endY}
        />
      ))}

      {activeConnection && (
        <ConnectorLine
          startX={activeConnection.startX}
          startY={activeConnection.startY}
          endX={activeConnection.endX}
          endY={activeConnection.endY}
          isDashed
        />
      )}
    </>
  );
};

export default ConnectionLines;