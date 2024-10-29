import React from 'react';

const DebugPositionSection = ({ debugData }) => {
  const colorizeValue = (value, axis) => {
    const color = axis === 'x' ? 'text-red-500' : axis === 'y' ? 'text-green-500' : 'text-blue-500';
    return <span className={color}>{value}</span>;
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-white/80">Position</h3>
      <div className="bg-black/50 p-2 rounded">
        <p className="text-xs">Position: (
          {colorizeValue(debugData?.position?.x || '0', 'x')}, 
          {colorizeValue(debugData?.position?.y || '0', 'y')}, 
          {colorizeValue(debugData?.position?.z || '0', 'z')})
        </p>
        <p className="text-xs mt-1">Mouse: (
          {colorizeValue(debugData?.mouse?.x || '0', 'x')}, 
          {colorizeValue(debugData?.mouse?.y || '0', 'y')}, 
          {colorizeValue(debugData?.mouse?.z || '0', 'z')})
        </p>
      </div>
    </div>
  );
};

export default DebugPositionSection;