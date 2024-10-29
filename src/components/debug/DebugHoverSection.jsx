import React from 'react';

const DebugHoverSection = ({ hoveredElement }) => {
  if (!hoveredElement) return null;

  return (
    <div className="space-y-2 mb-4 border-b border-white/10 pb-4">
      <h3 className="text-sm font-medium text-white/80">Hovered Element</h3>
      <div className="bg-black/50 p-2 rounded">
        <p className="text-xs font-medium">Component: {hoveredElement.component || 'Unknown'}</p>
        {hoveredElement.metadata && (
          <div className="mt-1 space-y-1 border-l-2 border-white/10 pl-2">
            {Object.entries(hoveredElement.metadata).map(([key, value]) => (
              <p key={key} className="text-xs">
                {key}: {typeof value === 'object' ? JSON.stringify(value) : value}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DebugHoverSection;