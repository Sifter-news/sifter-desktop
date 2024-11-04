import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export const useConnectionHandling = () => {
  const [connections, setConnections] = useState([]);
  const [activeConnection, setActiveConnection] = useState(null);
  const [selectedConnection, setSelectedConnection] = useState(null);

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
    } else if (selectedConnection) {
      // Move existing connection
      setConnections(prev => prev.map(conn => 
        conn.id === selectedConnection.id 
          ? { ...conn, endX: point.clientX, endY: point.clientY }
          : conn
      ));
    }
  }, [activeConnection, selectedConnection]);

  const handleConnectionEnd = useCallback((targetNodeId, targetPosition) => {
    if (activeConnection && targetNodeId !== activeConnection.sourceNodeId) {
      const newConnection = {
        id: `${activeConnection.sourceNodeId}-${targetNodeId}-${Date.now()}`,
        sourceNodeId: activeConnection.sourceNodeId,
        targetNodeId,
        sourcePosition: activeConnection.sourcePosition,
        targetPosition,
        startX: activeConnection.startX,
        startY: activeConnection.startY,
        endX: activeConnection.endX,
        endY: activeConnection.endY
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
    handleConnectionStart,
    handleConnectionMove,
    handleConnectionEnd,
    removeConnection,
    selectConnection,
    setActiveConnection,
    setSelectedConnection
  };
};