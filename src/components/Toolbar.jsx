import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  MousePointer2, 
  Hand, 
  Orbit, 
  Square, 
  ChevronDown,
  FileText,
  User,
  Building2,
  Package,
  Brain,
  MapPin,
  Calendar,
  Plus
} from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  const handleAddNodeWithStyle = (visualStyle, nodeType = 'generic') => {
    const newNode = { 
      visualStyle,
      nodeType,
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
    <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm rounded-xl shadow-lg p-0.75 border border-white/20">
      <div className="bg-black/90 rounded-xl p-0.25 flex items-center space-x-2 h-10">
        {/* Navigation Tools Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className={`h-8 w-8 rounded-lg transition-colors ${
                activeTool === 'select' || activeTool === 'pan' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {activeTool === 'select' ? <MousePointer2 className="h-4 w-4" /> : <Hand className="h-4 w-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black text-white" align="top">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setActiveTool('select')}>
                <MousePointer2 className="h-4 w-4 mr-2" />
                Select & Move
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTool('pan')}>
                {viewMode === '3d' ? <Orbit className="h-4 w-4 mr-2" /> : <Hand className="h-4 w-4 mr-2" />}
                {viewMode === '3d' ? "Pan & Orbit" : "Pan"}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6 bg-white/20" />

        {/* Node Creation Tools Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 rounded-lg text-white hover:bg-white/10"
            >
              <Square className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black text-white" align="top">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleAddNodeWithStyle('generic', 'generic')}>
                <FileText className="h-4 w-4 mr-2" />
                Generic Note
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddNodeWithStyle('generic', 'node_person')}>
                <User className="h-4 w-4 mr-2" />
                Person
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddNodeWithStyle('generic', 'node_organization')}>
                <Building2 className="h-4 w-4 mr-2" />
                Organization
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddNodeWithStyle('generic', 'node_object')}>
                <Package className="h-4 w-4 mr-2" />
                Object
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddNodeWithStyle('generic', 'node_concept')}>
                <Brain className="h-4 w-4 mr-2" />
                Concept
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddNodeWithStyle('generic', 'node_location')}>
                <MapPin className="h-4 w-4 mr-2" />
                Location
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddNodeWithStyle('generic', 'node_event')}>
                <Calendar className="h-4 w-4 mr-2" />
                Event
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6 bg-white/20" />

        {/* Zoom Level Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 rounded-lg text-white hover:bg-white/10"
            >
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

        <Separator orientation="vertical" className="h-6 bg-white/20" />

        {/* Perspective Toggle Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost"
              size="sm"
              className="h-8 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 text-white hover:bg-white/10"
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

        <Separator orientation="vertical" className="h-6 bg-white/20" />

        {/* Add Button Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 rounded-lg text-white hover:bg-white/10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black text-white" align="top">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleAddNodeWithStyle('generic', 'node_object')}>
                <Package className="h-4 w-4 mr-2" />
                Object
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddNodeWithStyle('generic', 'node_person')}>
                <User className="h-4 w-4 mr-2" />
                Person
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddNodeWithStyle('generic', 'node_event')}>
                <Calendar className="h-4 w-4 mr-2" />
                Event
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddNodeWithStyle('generic', 'node_location')}>
                <MapPin className="h-4 w-4 mr-2" />
                Location
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddNodeWithStyle('generic', 'node_concept')}>
                <Brain className="h-4 w-4 mr-2" />
                Concept
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Toolbar;
