import React from 'react';
import { Map, Timeline, Network, Eye } from 'lucide-react';

const DebugViewSection = ({ currentView, viewMode }) => {
  const getViewIcon = (view) => {
    switch (view) {
      case 'mindmap':
        return <Network className="h-4 w-4 text-purple-400" />;
      case 'timeline':
        return <Timeline className="h-4 w-4 text-blue-400" />;
      case 'map':
        return <Map className="h-4 w-4 text-green-400" />;
      default:
        return <Eye className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-white/80">Project View 👁️</p>
      <div className="pl-2 space-y-2">
        <div className="flex items-center gap-2">
          {getViewIcon(currentView)}
          <p className="text-xs">Canvas: {currentView || 'Unknown'}</p>
        </div>
        {currentView === 'mindmap' && (
          <p className="text-xs pl-6">Perspective: {viewMode || '2D'} 🎥</p>
        )}
      </div>
    </div>
  );
};

export default DebugViewSection;