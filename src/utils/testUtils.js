import { act } from 'react-dom/test-utils';

export const simulateNodeOperation = async (operation, node) => {
  let error = null;
  
  try {
    await act(async () => {
      switch (operation) {
        case 'create':
          // Test node creation
          if (!node.title) {
            throw new Error('Node title is required');
          }
          break;
          
        case 'update':
          // Test node update
          if (!node.id) {
            throw new Error('Node ID is required for updates');
          }
          break;
          
        case 'delete':
          // Test node deletion
          if (!node.id) {
            throw new Error('Node ID is required for deletion');
          }
          break;
          
        case 'move':
          // Test node movement
          if (!node.x || !node.y) {
            throw new Error('Node position is required');
          }
          break;
          
        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
    });
  } catch (e) {
    error = e;
    // Report error to debug panel
    if (window.__DEBUG_PANEL__) {
      window.__DEBUG_PANEL__.addError({
        type: 'test',
        operation,
        message: e.message,
        nodeId: node.id
      });
    }
  }
  
  return { error };
};

export const validateNodeConnections = (nodes, connections) => {
  const errors = [];
  
  connections.forEach(connection => {
    const sourceNode = nodes.find(n => n.id === connection.source);
    const targetNode = nodes.find(n => n.id === connection.target);
    
    if (!sourceNode) {
      errors.push(`Source node ${connection.source} not found`);
    }
    if (!targetNode) {
      errors.push(`Target node ${connection.target} not found`);
    }
  });
  
  if (errors.length > 0 && window.__DEBUG_PANEL__) {
    window.__DEBUG_PANEL__.addError({
      type: 'validation',
      message: 'Invalid connections found',
      details: errors
    });
  }
  
  return errors;
};