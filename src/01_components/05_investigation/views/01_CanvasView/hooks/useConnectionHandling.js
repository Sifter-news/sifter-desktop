import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export const useConnectionHandling = () => {
  const [connections, setConnections] = useState([]);
  const [activeConnection, setActiveConnection] = useState(null);
  const [selectedConnection, setSelectedConnection] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleConnectionStart = useCallback((nodeId, point, position) => {
    setIsDragging(true);
    setActiveConnection({
      id: `temp-${Date.now()}`,
      sourceNodeId: nodeId,
      sourcePosition: position,
      startX: point.x,
      startY: point.y,
      endX: point.x,
      endY: point.y,
      isAnchored: false
    });
  }, []);

  const handleConnectionMove = useCallback((e) => {
    if (activeConnection && isDragging) {
      setActiveConnection(prev => ({
        ...prev,
        endX: e.clientX,
        endY: e.clientY
      }));
    }
  }, [activeConnection, isDragging]);

  const handleConnectionEnd = useCallback((targetNodeId, point, position) => {
    if (activeConnection && targetNodeId !== activeConnection.sourceNodeId) {
      const newConnection = {
        id: `connection-${Date.now()}`,
        sourceNodeId: activeConnection.sourceNodeId,
        targetNodeId,
        sourcePosition: activeConnection.sourcePosition,
        targetPosition: position,
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
    setIsDragging(false);
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
    isDragging,
    handleConnectionStart,
    handleConnectionMove,
    handleConnectionEnd,
    removeConnection,
    selectConnection,
    setActiveConnection,
    setSelectedConnection
  };
};