import React from 'react';
import { Button } from "@/components/ui/button";
import { Minus, Plus, Hand, MousePointer, Sparkles, Square, StickyNote, Type, Link, Layers, Download } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ToolButton from './ToolbarButton';

const Toolbar = ({ activeTool, setActiveTool, handleAIClick, handleAddNode, handleZoom, zoom }) => {
  return (
    <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full shadow-lg p-2 flex items-center space-x-2">
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
      <ToolButton icon={<Sparkles className="h-4 w-4" />} label="AI Node" onClick={handleAIClick} />
      <ToolButton icon={<Square className="h-4 w-4" />} label="Blank Node" onClick={() => handleAddNode('blank')} />
      <ToolButton icon={<StickyNote className="h-4 w-4" />} label="Post-it Node" onClick={() => handleAddNode('postit')} />
      <ToolButton icon={<Type className="h-4 w-4" />} label="Text Node" onClick={() => handleAddNode('text')} />
      <ToolButton icon={<Link className="h-4 w-4" />} label="Connector Node" onClick={() => handleAddNode('connector')} />
      <ToolButton icon={<Layers className="h-4 w-4" />} label="Grouped Section Node" onClick={() => handleAddNode('group')} />
      <div className="flex flex-col items-center space-y-1">
        <ToolButton icon={<Plus className="h-4 w-4" />} label="Zoom In" onClick={() => handleZoom(0.1)} />
        <span className="text-xs font-medium">{Math.round(zoom * 100)}%</span>
        <ToolButton icon={<Minus className="h-4 w-4" />} label="Zoom Out" onClick={() => handleZoom(-0.1)} />
      </div>
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