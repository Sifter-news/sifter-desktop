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
      const newConnection = {
        id: `${activeConnection.sourceNodeId}-${targetNodeId}`,
        sourceNodeId: activeConnection.sourceNodeId,
        targetNodeId,
        sourcePosition: activeConnection.sourcePosition,
        targetPosition,
        startX: activeConnection.startX,
        startY: activeConnection.startY,
        endX: activeConnection.endX,
        endY: activeConnection.endY
      };

      setConnections(prev => {
        // Check for existing connection
        const exists = prev.some(conn => 
          (conn.sourceNodeId === newConnection.sourceNodeId && conn.targetNodeId === newConnection.targetNodeId) ||
          (conn.sourceNodeId === newConnection.targetNodeId && conn.targetNodeId === newConnection.sourceNodeId)
        );

        if (exists) {
          toast.error('Connection already exists between these nodes');
          return prev;
        }

        toast.success('Connection created');
        return [...prev, newConnection];
      });
      setActiveConnection(null);
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