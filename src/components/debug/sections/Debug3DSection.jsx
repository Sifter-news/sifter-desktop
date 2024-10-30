import React from 'react';
import { Box3 } from 'lucide-react';

const Debug3DSection = ({ camera, rotation }) => {
  if (!camera) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Box3 className="h-4 w-4 text-blue-400" />
        <h3 className="text-sm font-medium text-white/80">3D Information 🎲</h3>
      </div>
      <div className="bg-black/50 p-2 rounded text-xs space-y-1">
        <div className="space-y-1">
          <p className="text-white/60">Camera Position:</p>
          <p className="pl-2">
            X: <span className="text-red-400">{camera.position?.x?.toFixed(2) || '0'}</span>
            Y: <span className="text-green-400">{camera.position?.y?.toFixed(2) || '0'}</span>
            Z: <span className="text-blue-400">{camera.position?.z?.toFixed(2) || '0'}</span>
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-white/60">Camera Rotation:</p>
          <p className="pl-2">
            X: <span className="text-red-400">{(camera.rotation?.x * (180/Math.PI))?.toFixed(2) || '0'}°</span>
            Y: <span className="text-green-400">{(camera.rotation?.y * (180/Math.PI))?.toFixed(2) || '0'}°</span>
            Z: <span className="text-blue-400">{(camera.rotation?.z * (180/Math.PI))?.toFixed(2) || '0'}°</span>
          </p>
        </div>
        <div className="space-y-1">
          <p className="text-white/60">Camera Settings:</p>
          <div className="pl-2">
            <p>FOV: <span className="text-purple-400">{camera.fov || '45'}°</span></p>
            <p>Distance: <span className="text-purple-400">{camera.distance?.toFixed(2) || '0'}</span></p>
            <p>Zoom: <span className="text-purple-400">{camera.zoom?.toFixed(2) || '1'}x</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Debug3DSection;