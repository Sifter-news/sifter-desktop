import React from 'react';
import { Switch } from "@/components/ui/switch";

const DebugViewOptions = ({ showGuides, setShowGuides }) => {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-white/80">View Options</h3>
      <div className="bg-black/50 p-2 rounded flex items-center justify-between">
        <span className="text-xs">Show Guide Lines</span>
        <Switch
          checked={showGuides}
          onCheckedChange={setShowGuides}
          className="data-[state=checked]:bg-green-500"
        />
      </div>
    </div>
  );
};

export default DebugViewOptions;