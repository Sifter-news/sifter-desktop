import React from 'react';
import { Button } from "@/components/ui/button";
import { simulateNodeOperation, validateNodeConnections } from '@/utils/testUtils';

const DebugTestSection = ({ nodes, connections }) => {
  const runTests = async () => {
    // Test node operations
    const testNode = {
      id: 'test-node',
      title: 'Test Node',
      x: 100,
      y: 100
    };
    
    const results = await Promise.all([
      simulateNodeOperation('create', testNode),
      simulateNodeOperation('update', testNode),
      simulateNodeOperation('move', testNode),
      simulateNodeOperation('delete', testNode)
    ]);
    
    // Test connections
    const connectionErrors = validateNodeConnections(nodes, connections);
    
    // Update debug panel with results
    if (window.__DEBUG_PANEL__) {
      window.__DEBUG_PANEL__.addTestResults({
        nodeOperations: results,
        connectionValidation: connectionErrors
      });
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-white/80">Test Panel</h3>
      <div className="bg-black/50 p-2 rounded">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={runTests}
          className="w-full"
        >
          Run Tests
        </Button>
        <div className="mt-2 space-y-1 text-xs">
          <p>• Node Operations</p>
          <p>• Connection Validation</p>
          <p>• Error Handling</p>
        </div>
      </div>
    </div>
  );
};

export default DebugTestSection;