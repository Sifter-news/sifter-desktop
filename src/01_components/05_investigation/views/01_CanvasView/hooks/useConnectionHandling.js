import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { NODE_STYLES } from '@/utils/nodeStyles';

export const useConnectionHandling = () => {
  // State for managing connections and active/selected states
  const [connections, setConnections] = useState([]);
  const [activeConnection, setActiveConnection] = useState(null);
  const [selectedConnection, setSelectedConnection] = useState(null);

  // Calculate connection anchor points based on node dimensions and style
  const calculateAnchorPoint = useCallback((node, position) => {
    const style = NODE_STYLES[node.visualStyle || 'default'];
    const width = style.width;
    const height = style.height;

    switch (position) {
      case 'left':
        return { x: node.x, y: node.y + height / 2 };
      case 'right':
        return { x: node.x + width, y: node.y + height / 2 };
      case 'top':
        return { x: node.x + width / 2, y: node.y };
      case 'bottom':
        return { x: node.x + width / 2, y: node.y + height };
      default:
        return { x: node.x, y: node.y };
    }
  }, []);

  // Validate connection between nodes
  const validateConnection = useCallback((sourceNodeId, targetNodeId, nodes) => {
    // Prevent self-connections
    if (sourceNodeId === targetNodeId) {
      return { valid: false, message: 'Cannot connect a node to itself' };
    }

    // Find and validate source and target nodes
    const sourceNode = nodes.find(n => n.id === sourceNodeId);
    const targetNode = nodes.find(n => n.id === targetNodeId);

    if (!sourceNode || !targetNode) {
      return { valid: false, message: 'Invalid nodes' };
    }

    // Prevent duplicate connections
    const existingConnection = connections.find(
      conn => conn.sourceNodeId === sourceNodeId && conn.targetNodeId === targetNodeId
    );
    if (existingConnection) {
      return { valid: false, message: 'Connection already exists' };
    }

    // Check for circular references in hierarchical connections
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
  }, [connections]);

  // Initialize connection creation
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

  // Update connection position during drag
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

  // Finalize connection creation
  const handleConnectionEnd = useCallback((targetNodeId, targetPosition, nodes) => {
    if (activeConnection) {
      // Validate the connection before creating
      const validation = validateConnection(activeConnection.sourceNodeId, targetNodeId, nodes);
      
      if (!validation.valid) {
        setActiveConnection(null);
        toast.error(validation.message);
        return;
      }

      // Create new connection with proper anchoring
      const sourceNode = nodes.find(n => n.id === activeConnection.sourceNodeId);
      const targetNode = nodes.find(n => n.id === targetNodeId);
      
      if (sourceNode && targetNode) {
        const sourceAnchor = calculateAnchorPoint(sourceNode, activeConnection.sourcePosition);
        const targetAnchor = calculateAnchorPoint(targetNode, targetPosition);

        const newConnection = {
          id: `${activeConnection.sourceNodeId}-${targetNodeId}-${Date.now()}`,
          sourceNodeId: activeConnection.sourceNodeId,
          targetNodeId,
          sourcePosition: activeConnection.sourcePosition,
          targetPosition,
          startX: sourceAnchor.x,
          startY: sourceAnchor.y,
          endX: targetAnchor.x,
          endY: targetAnchor.y,
          type: 'hierarchical' // Default to hierarchical connection type
        };
        
        setConnections(prev => [...prev, newConnection]);
        setActiveConnection(null);
        toast.success('Connection created');
      }
    }
  }, [activeConnection, validateConnection, calculateAnchorPoint]);

  // Remove an existing connection
  const removeConnection = useCallback((connectionId) => {
    setConnections(prev => prev.filter(conn => conn.id !== connectionId));
    setSelectedConnection(null);
    toast.success('Connection removed');
  }, []);

  // Select a connection for interaction
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