import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Minus, Plus, Hand, MousePointer, Sparkles, Pill, StickyNote, Type, Link, Users, Download } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ToolButton from './ToolbarButton';
import ExportDialog from './ExportDialog';

const Toolbar = ({ activeTool, setActiveTool, handleAIClick, handleAddNode, handleZoom, zoom, nodes, onDragStart }) => {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  const handleDragStart = (e, nodeType) => {
    e.dataTransfer.setData('nodeType', nodeType);
    onDragStart(nodeType);
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
        <div className="w-px h-6 bg-gray-300 mx-2"></div>
        <ToolButton icon={<Sparkles className="h-4 w-4" />} label="AI Node" onClick={handleAIClick} />
        <ToolButton 
          icon={<Pill className="h-4 w-4" />} 
          label="Blank Node" 
          onDragStart={(e) => handleDragStart(e, 'blank')}
          draggable
        />
        <ToolButton 
          icon={<StickyNote className="h-4 w-4" />} 
          label="Post-it Node" 
          onDragStart={(e) => handleDragStart(e, 'postit')}
          draggable
        />
        <ToolButton 
          icon={<Type className="h-4 w-4" />} 
          label="Text Node" 
          onDragStart={(e) => handleDragStart(e, 'text')}
          draggable
        />
        <ToolButton 
          icon={<Link className="h-4 w-4" />} 
          label="Connector Node" 
          onDragStart={(e) => handleDragStart(e, 'connector')}
          draggable
        />
        <ToolButton icon={<Users className="h-4 w-4" />} label="Grouped Section Node" onClick={() => handleAddNode('group')} />
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
                className="rounded-full px-4 bg-white bg-opacity-20"
                onClick={() => setIsExportDialogOpen(true)}
              >
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
      <ExportDialog 
        isOpen={isExportDialogOpen} 
        onClose={() => setIsExportDialogOpen(false)} 
        nodes={nodes}
      />
    </div>
  );
};

export default Toolbar;