import { useState, useCallback } from 'react';

export const useConnectionHandling = () => {
  const [connections, setConnections] = useState([]);
  const [activeConnection, setActiveConnection] = useState(null);

  const handleConnectionStart = useCallback((sourceNodeId, sourcePosition, startPoint) => {
    setActiveConnection({
      sourceNodeId,
      sourcePosition,
      startX: startPoint.x,
      startY: startPoint.y,
      endX: startPoint.x,
      endY: startPoint.y
    });
  }, []);

  const handleConnectionMove = useCallback((e) => {
    if (activeConnection) {
      setActiveConnection(prev => ({
        ...prev,
        endX: e.clientX,
        endY: e.clientY
      }));
    }
  }, [activeConnection]);

  const handleConnectionEnd = useCallback((targetNodeId, targetPosition) => {
    if (activeConnection && targetNodeId !== activeConnection.sourceNodeId) {
      setConnections(prev => [...prev, {
        id: `${activeConnection.sourceNodeId}-${targetNodeId}`,
        sourceNodeId: activeConnection.sourceNodeId,
        targetNodeId,
        sourcePosition: activeConnection.sourcePosition,
        targetPosition,
        startX: activeConnection.startX,
        startY: activeConnection.startY,
        endX: activeConnection.endX,
        endY: activeConnection.endY
      }]);
      setActiveConnection(null);
    }
  }, [activeConnection]);

  const removeConnection = useCallback((connectionId) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
  }, []);

  return {
    connections,
    activeConnection,
    handleConnectionStart,
    handleConnectionMove,
    handleConnectionEnd,
    removeConnection,
    setActiveConnection
  };
};