import React from 'react';
import { useDebug } from '@/contexts/DebugContext';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

const DebugPanel = () => {
  const { isDebugOpen, setIsDebugOpen, debugData } = useDebug();

  if (!isDebugOpen) return null;

  return (
    <div className="fixed top-4 right-4 w-96 bg-black/90 text-white rounded-lg shadow-xl z-[9999] backdrop-blur-sm">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold">Debug Panel</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDebugOpen(false)}
          className="text-white hover:text-white/80"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <ScrollArea className="h-[500px] p-4">
        <div className="space-y-4">
          {Object.entries(debugData).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <h3 className="text-sm font-medium text-white/80">{key}</h3>
              <pre className="bg-black/50 p-2 rounded text-xs overflow-auto">
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          ))}
          {Object.keys(debugData).length === 0 && (
            <p className="text-white/60 text-sm">No debug data available</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default DebugPanel;