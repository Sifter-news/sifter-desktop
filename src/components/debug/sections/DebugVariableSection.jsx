import React from 'react';
import { Variable } from 'lucide-react';

const DebugVariableSection = ({ debugData }) => {
  const formatValue = (value) => {
    if (typeof value === 'string') return <span className="text-green-400">"{value}"</span>;
    if (typeof value === 'number') return <span className="text-blue-400">{value}</span>;
    if (typeof value === 'boolean') return <span className="text-purple-400">{String(value)}</span>;
    if (value === null) return <span className="text-red-400">null</span>;
    if (value === undefined) return <span className="text-orange-400">undefined</span>;
    if (Array.isArray(value)) return <span className="text-yellow-400">[{value.length} items]</span>;
    if (typeof value === 'object') return <span className="text-cyan-400">{JSON.stringify(value)}</span>;
    return <span className="text-gray-400">{String(value)}</span>;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Variable className="h-4 w-4 text-blue-400" />
        <h3 className="text-sm font-medium text-white/80">Variables</h3>
      </div>
      <div className="bg-black/50 p-2 rounded space-y-2">
        {Object.entries(debugData || {}).map(([key, value]) => (
          <div key={key} className="text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-white/60">{key}:</span>
              {formatValue(value)}
            </div>
          </div>
        ))}
        {Object.keys(debugData || {}).length === 0 && (
          <p className="text-xs text-white/40">No variables available</p>
        )}
      </div>
    </div>
  );
};

export default DebugVariableSection;