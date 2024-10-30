import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown } from 'lucide-react';

const ZoomLevelMenu = ({ zoom, handleZoom }) => {
  const zoomPercentage = Math.round(100 * zoom);

  return (
    <Button 
      variant="ghost" 
      size="sm"
      className="h-8 rounded-lg text-white hover:text-white hover:bg-white/10 bg-white/[0.0625] flex items-center gap-1.5"
    >
      {zoomPercentage}%
      <ChevronDown className="h-3 w-3" />
    </Button>
  );
};

export default ZoomLevelMenu;