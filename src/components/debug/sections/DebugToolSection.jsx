import React from 'react';
import { MousePointer2, Move3d, Orbit, MessageCircle } from 'lucide-react';

const DebugToolSection = ({ activeTool }) => {
  const getToolIcon = (tool) => {
    switch (tool) {
      case 'select':
        return <MousePointer2 className="h-4 w-4 text-blue-400" />;
      case 'pan':
        return <Move3d className="h-4 w-4 text-green-400" />;
      case 'comment':
        return <MessageCircle className="h-4 w-4 text-purple-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-white/80">Active Tool 🛠️</p>
      <div className="pl-2 flex items-center gap-2">
        {getToolIcon(activeTool)}
        <p className="text-xs">{activeTool || 'None'}</p>
      </div>
    </div>
  );
};

export default DebugToolSection;