import React from 'react';
import { Button } from "@/components/ui/button";
import { Hand, Orbit, MousePointer, CirclePlus, Circle, Square, StickyNote, ChevronDown } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ToolbarButton from './ToolbarButton';
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

    const position = findNonCollidingPosition(newNode, nodes);
    onAddNode({ 
      ...newNode,
      x: position.x,
      y: position.y
    });
  };

  return (
    <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full shadow-lg p-3">
      <div className="bg-white/90 rounded-full p-1 flex items-center space-x-1 h-10">
        {/* Perspective Toggle Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost"
              size="sm"
              className="h-8 rounded-full text-sm font-medium transition-colors flex items-center gap-1"
            >
              {viewMode.toUpperCase()}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black text-white" align="top">
            <DropdownMenuItem onClick={() => onViewModeChange('2d')}>2D</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewModeChange('3d')}>3D</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6" />

        {/* Navigation Tools Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 rounded-full">
              {activeTool === 'select' ? <MousePointer className="h-3 w-3 mr-1" /> : <Hand className="h-3 w-3 mr-1" />}
              {activeTool === 'select' ? 'Select' : 'Pan'}
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black text-white" align="top">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setActiveTool('select')}>
                <MousePointer className="h-3 w-3 mr-2" />
                Select & Move (V)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTool('pan')}>
                {viewMode === '3d' ? <Orbit className="h-3 w-3 mr-2" /> : <Hand className="h-3 w-3 mr-2" />}
                {viewMode === '3d' ? "Pan & Orbit" : "Pan"} (Space)
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Node Creation Tools Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 rounded-full">
              <Circle className="h-3 w-3 mr-1" />
              Add Node
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black text-white" align="top">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleAddNodeWithStyle('compact')}>
                <Circle className="h-3 w-3 mr-2" />
                Compact Node (1)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddNodeWithStyle('default')}>
                <Square className="h-3 w-3 mr-2" />
                Default Node (2)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddNodeWithStyle('postit')}>
                <StickyNote className="h-3 w-3 mr-2" />
                Post-it Node (3)
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6" />

        {/* Zoom Level Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 rounded-full">
              {zoomPercentage}%
              <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black text-white" align="top">
            <DropdownMenuItem onClick={() => handleZoom(0.5)}>50%</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleZoom(1)}>100%</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleZoom(1.5)}>150%</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleZoom(2)}>200%</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Toolbar;