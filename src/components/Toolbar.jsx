import React from 'react';
import { Button } from "@/components/ui/button";
import { Minus, Plus, Orbit, Hand, CirclePlus, Download, Circle, Square, StickyNote } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import ToolbarButton from './ToolbarButton';
import ExportDialog from './ExportDialog';
import { findNonCollidingPosition } from '@/utils/collisionUtils';

const Toolbar = ({ 
  activeTool, 
  setActiveTool, 
  handleZoom, 
  zoom, 
  nodes, 
  viewMode = '3d',
  onViewModeChange 
}) => {
  const [isExportDialogOpen, setIsExportDialogOpen] = React.useState(false);

  // Calculate zoom percentage based on Z position (0-200 range)
  const zoomPercentage = Math.round(100 - (zoom / 2));

  const handleAddNodeWithStyle = (visualStyle) => {
    const newNode = { 
      visualStyle,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      title: 'New Node',
      description: 'Description',
      width: visualStyle === 'postit' ? 256 : 40,
      height: visualStyle === 'postit' ? 256 : visualStyle === 'compact' ? 40 : 128
    };

    // Find a non-colliding position for the new node
    const position = findNonCollidingPosition(newNode, nodes);
    onAddNode({ 
      ...newNode,
      x: position.x,
      y: position.y
    });
  };

  return (
    <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full shadow-lg p-1">
      <div className="bg-white/90 rounded-full p-1 flex items-center space-x-1 h-10">
        {/* Perspective Toggle Group */}
        <div className="flex items-center space-x-1 pl-2 h-8 bg-gray-200/80 rounded-full">
          <Button 
            variant="ghost"
            size="sm"
            className={`h-8 w-8 rounded-full text-sm font-medium transition-colors ${viewMode === '2d' ? 'bg-white text-black' : 'hover:bg-gray-200'}`}
            onClick={() => onViewModeChange(viewMode === '2d' ? '3d' : '2d')}
          >
            {viewMode === '2d' ? <Hand className="h-4 w-4" /> : <Orbit className="h-4 w-4" />}
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Navigation Tools Group */}
        <div className="flex items-center space-x-1 pl-2 h-8 bg-gray-300/80 rounded-full">
          <ToolbarButton 
            icon={<Hand className="h-3 w-3" />} 
            label="Select & Move Nodes"
            shortcut="V"
            onClick={() => setActiveTool('select')}
            isActive={activeTool === 'select'}
            activeClassName="bg-black text-white"
          />
          <ToolbarButton 
            icon={<Orbit className="h-3 w-3" />} 
            label="Pan & Orbit"
            shortcut="Space"
            onClick={() => setActiveTool('pan')}
            isActive={activeTool === 'pan'}
            activeClassName="bg-black text-white"
          />
        </div>

        {/* Node Creation Tools */}
        <div className="flex items-center space-x-1 pl-2 h-8 bg-gray-200/80 rounded-full">
          <ToolbarButton 
            icon={<Circle className="h-3 w-3" />}
            label="Add Compact Node"
            shortcut="1"
            onClick={() => handleAddNodeWithStyle('compact')}
            activeClassName="bg-black text-white"
          />
          <ToolbarButton 
            icon={<Square className="h-3 w-3" />}
            label="Add Default Node"
            shortcut="2"
            onClick={() => handleAddNodeWithStyle('default')}
            activeClassName="bg-black text-white"
          />
          <ToolbarButton 
            icon={<StickyNote className="h-3 w-3" />}
            label="Add Post-it Node"
            shortcut="3"
            onClick={() => handleAddNodeWithStyle('postit')}
            activeClassName="bg-black text-white"
          />
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Zoom Controls */}
        <div className="flex items-center space-x-1 pl-2 h-8 bg-gray-200/80 rounded-full">
          <div className="flex flex-col items-center space-y-0.5">
            <Button 
              size="icon" 
              variant="ghost" 
              className="rounded-full h-3 w-3 bg-black bg-opacity-5 hover:bg-gray-200 p-0" 
              onClick={() => handleZoom(-10)}
            >
              <Plus className="h-2 w-2" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="rounded-full h-3 w-3 bg-black bg-opacity-5 hover:bg-gray-200 p-0" 
              onClick={() => handleZoom(10)}
            >
              <Minus className="h-2 w-2" />
            </Button>
          </div>
          <div className="flex items-center justify-center w-8">
            <span className="text-xs font-medium">{zoomPercentage}%</span>
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
                className="rounded-full h-8 w-8 bg-white hover:bg-gray-100 active:scale-95 transition-all duration-200 p-0"
                onClick={() => setIsExportDialogOpen(true)}
              >
                <Download className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-gray-900 text-white px-3 py-1.5 rounded-md text-sm">
              <p>Export Mind Map (⌘E)</p>
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
