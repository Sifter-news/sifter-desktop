import React from 'react';
import { Button } from "@/components/ui/button";
import { Minus, Plus, Hand, MousePointer, CirclePlus, Download, Circle, Square, StickyNote, View } from 'lucide-react';
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
  onAddNode,
  viewMode = '3d',
  onViewModeChange 
}) => {
  const [isExportDialogOpen, setIsExportDialogOpen] = React.useState(false);

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
    <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full shadow-lg p-2">
      <div className="bg-white/90 rounded-full p-2 flex items-center space-x-2">
        {/* Navigation Tools Group */}
        <div className="flex items-center space-x-1 px-2 py-1 bg-gray-300/80 rounded-full">
          <ToolbarButton 
            icon={<MousePointer className="h-4 w-4" />} 
            label="Select & Move Nodes"
            shortcut="V"
            onClick={() => setActiveTool('select')}
            isActive={activeTool === 'select'}
          />
          <ToolbarButton 
            icon={<Hand className="h-4 w-4" />} 
            label="Pan & Orbit"
            shortcut="Space"
            onClick={() => setActiveTool('pan')}
            isActive={activeTool === 'pan'}
            activeClassName="bg-blue-600 text-white"
          />
          <ToolbarButton 
            icon={<View className="h-4 w-4" />} 
            label="Toggle 2D/3D View"
            shortcut="Tab"
            onClick={() => onViewModeChange(viewMode === '2d' ? '3d' : '2d')}
            isActive={viewMode === '2d'}
            activeClassName="bg-purple-600 text-white"
            text={viewMode.toUpperCase()}
          />
        </div>

        {/* Node Creation Tools */}
        <div className="flex items-center space-x-1 px-2 py-1 bg-gray-200/80 rounded-full">
          <ToolbarButton 
            icon={<Circle className="h-4 w-4" />}
            label="Add Compact Node"
            shortcut="1"
            onClick={() => handleAddNodeWithStyle('compact')}
          />
          <ToolbarButton 
            icon={<Square className="h-4 w-4" />}
            label="Add Default Node"
            shortcut="2"
            onClick={() => handleAddNodeWithStyle('default')}
          />
          <ToolbarButton 
            icon={<StickyNote className="h-4 w-4" />}
            label="Add Post-it Node"
            shortcut="3"
            onClick={() => handleAddNodeWithStyle('postit')}
          />
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Zoom Controls */}
        <div className="flex items-center space-x-1 px-2 py-1 bg-gray-200/80 rounded-full">
          <div className="flex flex-col items-center space-y-1">
            <Button 
              size="icon" 
              variant="ghost" 
              className="rounded-full h-3 w-3 bg-black bg-opacity-5 hover:bg-gray-200" 
              onClick={() => handleZoom(0.1)}
            >
              <Plus className="h-2 w-2" />
            </Button>
            <Button 
              size="icon" 
              variant="ghost" 
              className="rounded-full h-3 w-3 bg-black bg-opacity-5 hover:bg-gray-200" 
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
                className="rounded-full bg-white hover:bg-gray-100 active:scale-95 transition-all duration-200"
                onClick={() => setIsExportDialogOpen(true)}
              >
                <Download className="h-4 w-4" />
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
