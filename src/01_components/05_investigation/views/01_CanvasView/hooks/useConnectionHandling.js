import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export const useConnectionHandling = () => {
  const [connections, setConnections] = useState([]);
  const [activeConnection, setActiveConnection] = useState(null);
  const [selectedConnection, setSelectedConnection] = useState(null);

  const handleConnectionStart = useCallback((nodeId, point) => {
    setActiveConnection({
      id: `temp-${Date.now()}`,
      sourceNodeId: nodeId,
      startX: point.x,
      startY: point.y,
      endX: point.x,
      endY: point.y,
      isAnchored: false
    });
  }, []);

  const handleConnectionMove = useCallback((point) => {
    if (activeConnection) {
      setActiveConnection(prev => ({
        ...prev,
        endX: point.x,
        endY: point.y
      }));
    }
  }, [activeConnection]);

  const handleConnectionEnd = useCallback((targetNodeId, point) => {
    if (activeConnection && targetNodeId !== activeConnection.sourceNodeId) {
      const newConnection = {
        id: `connection-${Date.now()}`,
        sourceNodeId: activeConnection.sourceNodeId,
        targetNodeId,
        startX: activeConnection.startX,
        startY: activeConnection.startY,
        endX: point.x,
        endY: point.y,
        isAnchored: true
      };
      
      setConnections(prev => [...prev, newConnection]);
      toast.success('Connection created');
    }
    setActiveConnection(null);
  }, [activeConnection]);

  const selectConnection = useCallback((connection) => {
    setSelectedConnection(prev => prev?.id === connection.id ? null : connection);
  }, []);

  const removeConnection = useCallback((connectionId) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    setSelectedConnection(null);
    toast.success('Connection removed');
  }, []);

  return {
    connections,
    activeConnection,
    selectedConnection,
    handleConnectionStart,
    handleConnectionMove,
    handleConnectionEnd,
    removeConnection,
    selectConnection,
    setActiveConnection,
    setSelectedConnection
  };
};