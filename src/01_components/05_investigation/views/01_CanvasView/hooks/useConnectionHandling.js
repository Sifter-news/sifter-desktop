import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export const useConnectionHandling = () => {
  const [connections, setConnections] = useState([]);
  const [activeConnection, setActiveConnection] = useState(null);
  const [selectedConnection, setSelectedConnection] = useState(null);

  const validateConnection = useCallback((sourceNodeId, targetNodeId, nodes) => {
    // Prevent self-connections
    if (sourceNodeId === targetNodeId) {
      return { valid: false, message: 'Cannot connect a node to itself' };
    }

    // Find source and target nodes
    const sourceNode = nodes.find(n => n.id === sourceNodeId);
    const targetNode = nodes.find(n => n.id === targetNodeId);

    if (!sourceNode || !targetNode) {
      return { valid: false, message: 'Invalid nodes' };
    }

    // Check for existing connection
    const existingConnection = connections.find(
      conn => conn.sourceNodeId === sourceNodeId && conn.targetNodeId === targetNodeId
    );
    if (existingConnection) {
      return { valid: false, message: 'Connection already exists' };
    }

    // Check for circular references
    const hasCircularReference = (currentId, visited = new Set()) => {
      if (visited.has(currentId)) return true;
      visited.add(currentId);
      
      const childConnections = connections.filter(conn => conn.sourceNodeId === currentId);
      return childConnections.some(conn => hasCircularReference(conn.targetNodeId, new Set(visited)));
    };

    if (hasCircularReference(targetNodeId)) {
      return { valid: false, message: 'Circular connection detected' };
    }

    return { valid: true };
  });

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
      setConnections(prev => prev.map(conn => 
        conn.id === selectedConnection.id 
          ? { ...conn, endX: point.clientX, endY: point.clientY }
          : conn
      ));
    }
  }, [activeConnection, selectedConnection]);

  const handleConnectionEnd = useCallback((targetNodeId, targetPosition, nodes) => {
    if (activeConnection) {
      const validation = validateConnection(activeConnection.sourceNodeId, targetNodeId, nodes);
      
      if (!validation.valid) {
        setActiveConnection(null);
        toast.error(validation.message);
        return;
      }

      const newConnection = {
        id: `${activeConnection.sourceNodeId}-${targetNodeId}-${Date.now()}`,
        sourceNodeId: activeConnection.sourceNodeId,
        targetNodeId,
        sourcePosition: activeConnection.sourcePosition,
        targetPosition,
        startX: activeConnection.startX,
        startY: activeConnection.startY,
        endX: activeConnection.endX,
        endY: activeConnection.endY,
        type: 'hierarchical' // Default to hierarchical connection type
      };
      
      setConnections(prev => [...prev, newConnection]);
      setActiveConnection(null);
      toast.success('Connection created');
    }
  }, [activeConnection, validateConnection]);

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