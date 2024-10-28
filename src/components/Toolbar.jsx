import React from 'react';
import { Button } from "@/components/ui/button";
import { Minus, Plus, Hand, MousePointer, CirclePlus, Download, StickyNote } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ToolButton from './ToolbarButton';
import ExportDialog from './ExportDialog';

const Toolbar = ({ activeTool, setActiveTool, handleZoom, zoom, nodes, onAddNode }) => {
  const [isExportDialogOpen, setIsExportDialogOpen] = React.useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('nodeType', 'postit');
  };

  const handleToolChange = (tool) => {
    setActiveTool(tool);
    // Reset cursor state when changing tools
    document.body.style.cursor = tool === 'pan' ? 'grab' : 'default';
  };

  return (
    <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full shadow-lg p-2">
      <div className="bg-white rounded-full p-2 flex items-center space-x-2">
        <ToolButton 
          icon={<MousePointer className="h-4 w-4" />} 
          label="Select"
          onClick={() => handleToolChange('select')}
          isActive={activeTool === 'select'}
        />
        <ToolButton 
          icon={<Hand className="h-4 w-4" />} 
          label="Pan"
          onClick={() => handleToolChange('pan')}
          isActive={activeTool === 'pan'}
        />
        <div className="w-px h-6 bg-gray-300 mx-2" />
        <ToolButton 
          icon={<CirclePlus className="h-4 w-4" />}
          label="Add Node"
          onClick={onAddNode}
          isActive={false}
        />
        <ToolButton 
          icon={<StickyNote className="h-4 w-4" />}
          label="Add Post-it"
          onClick={() => onAddNode({ type: 'postit' })}
          draggable
          onDragStart={handleDragStart}
          isActive={false}
        />
        <div className="flex items-center space-x-2">
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