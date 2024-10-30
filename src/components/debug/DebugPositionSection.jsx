import React from 'react';

const DebugPositionSection = ({ debugData }) => {
  const colorizeValue = (value, axis) => {
    const color = axis === 'x' ? 'text-red-500' : axis === 'y' ? 'text-green-500' : 'text-blue-500';
    return <span className={color}>{value?.toFixed(2) || '0'}</span>;
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-white/80">Position & Camera</h3>
      <div className="bg-black/50 p-2 rounded space-y-2">
        <div className="space-y-1">
          <p className="text-xs font-medium text-white/60">Object Position</p>
          <p className="text-xs pl-2">Position: (
            {colorizeValue(debugData?.position?.x, 'x')}, 
            {colorizeValue(debugData?.position?.y, 'y')}, 
            {colorizeValue(debugData?.position?.z, 'z')})
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-medium text-white/60">Mouse Position</p>
          <p className="text-xs pl-2">Coordinates: (
            {colorizeValue(debugData?.mouse?.x, 'x')}, 
            {colorizeValue(debugData?.mouse?.y, 'y')}, 
            {colorizeValue(debugData?.mouse?.z, 'z')})
          </p>
        </div>

        {debugData?.camera && (
          <>
            <div className="space-y-1">
              <p className="text-xs font-medium text-white/60">Camera Position</p>
              <p className="text-xs pl-2">Position: (
                {colorizeValue(debugData.camera.position?.x, 'x')}, 
                {colorizeValue(debugData.camera.position?.y, 'y')}, 
                {colorizeValue(debugData.camera.position?.z, 'z')})
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-white/60">Camera Rotation</p>
              <p className="text-xs pl-2">Rotation: (
                {colorizeValue(debugData.camera.rotation?.x * (180/Math.PI), 'x')}°, 
                {colorizeValue(debugData.camera.rotation?.y * (180/Math.PI), 'y')}°, 
                {colorizeValue(debugData.camera.rotation?.z * (180/Math.PI), 'z')}°)
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium text-white/60">Camera Settings</p>
              <div className="text-xs pl-2 space-y-0.5">
                <p>Max Distance: <span className="text-purple-400">20000</span></p>
                <p>Min Distance: <span className="text-purple-400">10</span></p>
                <p>Current Distance: <span className="text-purple-400">
                  {debugData.camera.distance?.toFixed(2) || '0'}
                </span></p>
                <p>FOV: <span className="text-purple-400">
                  {debugData.camera.fov || '45'}°
                </span></p>
                <p>Zoom: <span className="text-purple-400">
                  {(debugData.camera.zoom || 1).toFixed(2)}x
                </span></p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DebugPositionSection;