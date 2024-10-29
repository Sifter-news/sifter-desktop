import { useState } from 'react';

export const useConnections = () => {
  const [connections, setConnections] = useState([]);
  const [activeConnection, setActiveConnection] = useState(null);

  const handleStartConnection = (sourceId, sourcePosition) => {
    setActiveConnection({
      sourceId,
      sourcePosition,
      targetPosition: sourcePosition
    });
  };

  const handleEndConnection = (targetId) => {
    if (activeConnection && activeConnection.sourceId !== targetId) {
      setConnections(prev => [...prev, {
        id: Date.now(),
        sourceId: activeConnection.sourceId,
        targetId: targetId,
        sourcePosition: activeConnection.sourcePosition,
        targetPosition: activeConnection.targetPosition
      }]);
    }
    setActiveConnection(null);
  };

  return {
    connections,
    setConnections,
    activeConnection,
    setActiveConnection,
    handleStartConnection,
    handleEndConnection
  };
};