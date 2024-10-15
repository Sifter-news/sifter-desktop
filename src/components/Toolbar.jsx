import React from 'react';
import { Button } from "@/components/ui/button";
import { Hand, Sparkles, Square, StickyNote, Type, Link, Layers, ToggleLeft, ZoomIn, ZoomOut, Download, MousePointer } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ToolButton from './ToolbarButton';

const Toolbar = ({ activeTool, setActiveTool, handleAIClick, handleAddNode, handleZoom, zoom }) => {
  return (
    <div className="flex items-center space-x-2">
      <ToolButton 
        icon={activeTool === 'select' ? <MousePointer className="h-4 w-4" /> : <Hand className="h-4 w-4" />} 
        label={activeTool === 'select' ? "Select" : "Pan"} 
        onClick={() => setActiveTool(activeTool === 'select' ? 'pan' : 'select')}
      />
      <ToolButton icon={<Sparkles className="h-4 w-4" />} label="AI Node" onClick={handleAIClick} />
      <div className="bg-gray-100 p-1 rounded-md flex items-center space-x-1">
        <ToolButton icon={<PlusIcon className="h-4 w-4" />} label="Add" onClick={() => {}} />
        <ToolButton icon={<Square className="h-4 w-4" />} label="Blank Node" onClick={() => handleAddNode('blank')} />
        <ToolButton icon={<StickyNote className="h-4 w-4" />} label="Post-it Node" onClick={() => handleAddNode('postit')} />
        <ToolButton icon={<Type className="h-4 w-4" />} label="Text Node" onClick={() => handleAddNode('text')} />
      </div>
      <ToolButton icon={<Link className="h-4 w-4" />} label="Connector Node" onClick={() => handleAddNode('connector')} />
      <ToolButton icon={<Layers className="h-4 w-4" />} label="Grouped Section Node" />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center space-x-1">
              <Button size="icon" variant="ghost" className="rounded-full">
                <ToggleLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">2D</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Toggle 2D/3D View</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <ToolButton icon={<ZoomIn className="h-4 w-4" />} label="Zoom In" onClick={() => handleZoom(0.1)} />
      <span className="text-sm font-medium">{Math.round(zoom * 100)}%</span>
      <ToolButton icon={<ZoomOut className="h-4 w-4" />} label="Zoom Out" onClick={() => handleZoom(-0.1)} />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" className="rounded-full px-4">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export Mind Map</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default Toolbar;