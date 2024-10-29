import React from 'react';
import { Button } from "@/components/ui/button";
import { Minus, Plus, Hand, MousePointer, CirclePlus, Download, Circle, Square, StickyNote } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import ToolButton from './ToolbarButton';
import ExportDialog from './ExportDialog';

const Toolbar = ({ activeTool, setActiveTool, handleZoom, zoom, nodes, onAddNode }) => {
  const [isExportDialogOpen, setIsExportDialogOpen] = React.useState(false);

  const handleAddNodeWithStyle = (visualStyle) => {
    onAddNode({ 
      visualStyle,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      title: 'New Node',
      description: 'Description'
    });
  };

  return (
    <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full shadow-lg p-2">
      <div className="bg-white rounded-full p-2 flex items-center space-x-2">
        {/* Navigation Tools Group */}
        <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full">
          <ToolButton 
            icon={<MousePointer className="h-4 w-4" />} 
            label="Select & Move Nodes"
            onClick={() => setActiveTool('select')}
            isActive={activeTool === 'select'}
            activeClassName="bg-black text-white"
          />
          <ToolButton 
            icon={<Hand className="h-4 w-4" />} 
            label="Pan & Orbit"
            onClick={() => setActiveTool('pan')}
            isActive={activeTool === 'pan'}
            activeClassName="bg-blue-500 text-white"
          />
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Node Creation Tools */}
        <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full">
          <ToolButton 
            icon={<Circle className="h-4 w-4" />}
            label="Add Compact Node"
            onClick={() => handleAddNodeWithStyle('compact')}
          />
          <ToolButton 
            icon={<Square className="h-4 w-4" />}
            label="Add Default Node"
            onClick={() => handleAddNodeWithStyle('default')}
          />
          <ToolButton 
            icon={<StickyNote className="h-4 w-4" />}
            label="Add Post-it Node"
            onClick={() => handleAddNodeWithStyle('postit')}
          />
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Zoom Controls */}
        <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full">
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

        <Separator orientation="vertical" className="h-6" />

        {/* Export Tool */}
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