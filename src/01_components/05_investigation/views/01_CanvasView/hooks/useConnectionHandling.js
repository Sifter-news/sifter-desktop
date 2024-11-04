import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export const useConnectionHandling = () => {
  const [connections, setConnections] = useState([]);
  const [activeConnection, setActiveConnection] = useState(null);
  const [selectedConnection, setSelectedConnection] = useState(null);

  const handleDotClick = useCallback((nodeId, position, point) => {
    if (!activeConnection) {
      // Start new connection
      setActiveConnection({
        sourceNodeId: nodeId,
        sourcePosition: position,
        startX: point.x,
        startY: point.y,
        endX: point.x,
        endY: point.y
      });
    } else {
      // Complete connection
      if (nodeId !== activeConnection.sourceNodeId) {
        const newConnection = {
          id: `connection-${Date.now()}`,
          sourceNodeId: activeConnection.sourceNodeId,
          targetNodeId: nodeId,
          sourcePosition: activeConnection.sourcePosition,
          targetPosition: position,
          startX: activeConnection.startX,
          startY: activeConnection.startY,
          endX: point.x,
          endY: point.y
        };
        
        setConnections(prev => [...prev, newConnection]);
        toast.success('Connection created');
      }
      setActiveConnection(null);
    }
  }, [activeConnection]);

  const handleMouseMove = useCallback((point) => {
    if (activeConnection) {
      setActiveConnection(prev => ({
        ...prev,
        endX: point.x,
        endY: point.y
      }));
    }
  }, [activeConnection]);

  const removeConnection = useCallback((connectionId) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    setSelectedConnection(null);
    toast.success('Connection removed');
  }, []);

  const selectConnection = useCallback((connection) => {
    setSelectedConnection(connection);
  }, []);

  return {
    connections,
    activeConnection,
    selectedConnection,
    handleDotClick,
    handleMouseMove,
    removeConnection,
    selectConnection,
    setActiveConnection,
    setSelectedConnection
  };
};