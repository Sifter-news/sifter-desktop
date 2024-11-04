import { useState, useCallback } from 'react';
import { toast } from 'sonner';

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

  const handleConnectionMove = useCallback((point) => {
    if (activeConnection) {
      setActiveConnection(prev => ({
        ...prev,
        endX: point.clientX,
        endY: point.clientY
      }));
    }
  }, [activeConnection]);

  const handleConnectionEnd = useCallback((targetNodeId, targetPosition, endPoint) => {
    if (activeConnection && targetNodeId !== activeConnection.sourceNodeId) {
      const newConnection = {
        id: `${activeConnection.sourceNodeId}-${targetNodeId}`,
        sourceNodeId: activeConnection.sourceNodeId,
        targetNodeId,
        sourcePosition: activeConnection.sourcePosition,
        targetPosition,
        startX: activeConnection.startX,
        startY: activeConnection.startY,
        endX: endPoint.x,
        endY: endPoint.y
      };
      
      setConnections(prev => [...prev, newConnection]);
      setActiveConnection(null);
      toast.success('Connection created');
    } else if (activeConnection) {
      setActiveConnection(null);
      toast.error('Cannot connect a node to itself');
    }
  }, [activeConnection]);

  const removeConnection = useCallback((connectionId) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    toast.success('Connection removed');
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