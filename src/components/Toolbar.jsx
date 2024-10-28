import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Minus, Plus, Hand, MousePointer, CirclePlus, Download, StickyNote, Square, Layout, ChevronRight } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ToolButton from './ToolbarButton';
import ExportDialog from './ExportDialog';
import { cn } from "@/lib/utils";

const NodeStyleButton = ({ icon: Icon, label, style, onDragStart }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200"
          draggable
          onDragStart={(e) => {
            e.dataTransfer.setData('nodeType', style);
            onDragStart(e);
          }}
        >
          <Icon className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const Toolbar = ({ activeTool, setActiveTool, handleZoom, zoom, nodes, onAddNode }) => {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isNodeTrayOpen, setIsNodeTrayOpen] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full shadow-lg p-2">
      <div className="bg-white rounded-full p-2 flex items-center space-x-2">
        <ToolButton 
          icon={<MousePointer className="h-4 w-4" />} 
          label="Select"
          onClick={() => setActiveTool('select')}
          isActive={activeTool === 'select'}
        />
        <ToolButton 
          icon={<Hand className="h-4 w-4" />} 
          label="Pan"
          onClick={() => setActiveTool('pan')}
          isActive={activeTool === 'pan'}
        />
        <div className="w-px h-6 bg-gray-300 mx-2" />
        
        <div className="relative group">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full flex items-center justify-center"
            onClick={() => setIsNodeTrayOpen(!isNodeTrayOpen)}
          >
            <CirclePlus className="h-4 w-4" />
            <ChevronRight className={cn(
              "h-3 w-3 ml-0.5 transition-transform duration-200",
              isNodeTrayOpen ? "rotate-90" : ""
            )} />
          </Button>
          
          <div className={cn(
            "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/50 backdrop-blur-sm rounded-full p-2 flex items-center space-x-2 transition-all duration-200 origin-bottom",
            isNodeTrayOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
          )}>
            <NodeStyleButton
              icon={Square}
              label="Default Node"
              style="default"
              onDragStart={handleDragStart}
            />
            <NodeStyleButton
              icon={Layout}
              label="Compact Node"
              style="compact"
              onDragStart={handleDragStart}
            />
            <NodeStyleButton
              icon={StickyNote}
              label="Post-it Node"
              style="postit"
              onDragStart={handleDragStart}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex flex-col items-center space-y-1">
            <Button 
              size="icon" 
              variant="ghost" 
              className="rounded-full h-3 w-3 bg-black bg-opacity-5" 
              onClick={() => handleZoom(0.1)}
            >
              <Plus className="h-2 w-2" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="rounded-full h-3 w-3 bg-black bg-opacity-5" 
              onClick={() => handleZoom(-0.1)}
            >
              <Minus className="h-2 w-2" />
            </Button>
          </div>
          <div className="flex items-center justify-center w-12">
            <span className="text-xs font-medium">{Math.round(zoom * 100)}%</span>
          </div>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-full bg-white bg-opacity-20"
                onClick={() => setIsExportDialogOpen(true)}
              >
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export Mind Map</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <ExportDialog 
        isOpen={isExportDialogOpen} 
        onClose={() => setIsExportDialogOpen(false)} 
        nodes={nodes}
      />
    </div>
  );
};

export default Toolbar;