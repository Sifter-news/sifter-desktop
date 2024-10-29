import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Hand, 
  Orbit, 
  MousePointer, 
  Download, 
  Circle, 
  Square, 
  StickyNote, 
  ChevronDown,
  Move,
  Maximize,
  Target,
  Pencil,
  Link2,
  ArrowRight
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ExportDialog from './ExportDialog';
import { findNonCollidingPosition } from '@/utils/collisionUtils';

const Toolbar = ({ 
  activeTool, 
  setActiveTool, 
  handleZoom, 
  zoom, 
  nodes, 
  viewMode = '3d',
  onViewModeChange,
  onAddNode 
}) => {
  const [isExportDialogOpen, setIsExportDialogOpen] = React.useState(false);
  const zoomPercentage = Math.round(zoom * 100);

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

    const position = findNonCollidingPosition(newNode, nodes);
    onAddNode({ 
      ...newNode,
      x: position.x,
      y: position.y
    });
  };

  return (
    <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm rounded-full shadow-lg px-2 py-1.5">
      <div className="flex items-center space-x-0.5">
        <TooltipProvider>
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 rounded-full text-white hover:bg-white/10"
            onClick={() => handleAddNodeWithStyle('default')}
          >
            <Plus className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-white hover:bg-white/10">
                <Move className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/90 text-white border-white/20" align="top">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setActiveTool('select')}>
                  <MousePointer className="h-4 w-4 mr-2" />
                  Select (V)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveTool('pan')}>
                  {viewMode === '3d' ? <Orbit className="h-4 w-4 mr-2" /> : <Hand className="h-4 w-4 mr-2" />}
                  {viewMode === '3d' ? "Orbit" : "Pan"} (Space)
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-white hover:bg-white/10">
            <Square className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-white hover:bg-white/10">
            <Circle className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-white hover:bg-white/10">
            <Target className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-white hover:bg-white/10">
            <Pencil className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-white hover:bg-white/10">
            <Link2 className="h-4 w-4" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full bg-blue-500 text-white hover:bg-blue-600"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 bg-white/20" />

          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-white hover:bg-white/10">
            <Maximize className="h-4 w-4" />
          </Button>

          <span className="text-white/90 text-sm font-medium px-2">
            {zoomPercentage}%
          </span>

          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 rounded-full text-white hover:bg-white/10 px-3"
            onClick={() => setIsExportDialogOpen(true)}
          >
            Export
          </Button>
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