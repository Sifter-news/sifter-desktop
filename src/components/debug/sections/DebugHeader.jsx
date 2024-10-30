import React from 'react';
import { Bug, Minimize2, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const DebugHeader = ({ showGuides, setShowGuides, onCollapse, onClose }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/10">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Bug className="h-5 w-5 text-purple-400" />
          <h2 className="text-lg font-semibold">Debug Panel 🛠️</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/60">Guidelines</span>
          <Switch
            checked={showGuides}
            onCheckedChange={setShowGuides}
            className="data-[state=checked]:bg-green-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onCollapse}
          className="text-white hover:text-white/80"
        >
          <Minimize2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:text-white/80"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default DebugHeader;