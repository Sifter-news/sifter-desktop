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
  ChevronRight
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
    <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-white/20">
      <div className="bg-black/90 rounded-xl p-1 flex items-center space-x-1 h-10">
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
              {activeTool === 'select' ? <MousePointer2 className="h-5 w-5" /> : <Hand className="h-5 w-5" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black text-white" align="top">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setActiveTool('select')} className="flex justify-between">
                <div className="flex items-center">
                  <MousePointer2 className="h-5 w-5 mr-2" />
                  Select & Move
                </div>
                <ChevronRight className="h-4 w-4 ml-2 text-gray-400" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTool('pan')} className="flex justify-between">
                <div className="flex items-center">
                  {viewMode === '3d' ? <Orbit className="h-5 w-5 mr-2" /> : <Hand className="h-5 w-5 mr-2" />}
                  {viewMode === '3d' ? "Pan & Orbit" : "Pan"}
                </div>
                <ChevronRight className="h-4 w-4 ml-2 text-gray-400" />
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
              <Square className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black text-white" align="top">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleAddNodeWithStyle('generic', 'generic')} className="flex justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Generic Note
                </div>
                <ChevronRight className="h-4 w-4 ml-2 text-gray-400" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddNodeWithStyle('generic', 'node_person')} className="flex justify-between">
                <div className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Person
                </div>
                <ChevronRight className="h-4 w-4 ml-2 text-gray-400" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddNodeWithStyle('generic', 'node_organization')} className="flex justify-between">
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Organization
                </div>
                <ChevronRight className="h-4 w-4 ml-2 text-gray-400" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddNodeWithStyle('generic', 'node_object')} className="flex justify-between">
                <div className="flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Object
                </div>
                <ChevronRight className="h-4 w-4 ml-2 text-gray-400" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddNodeWithStyle('generic', 'node_concept')} className="flex justify-between">
                <div className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Concept
                </div>
                <ChevronRight className="h-4 w-4 ml-2 text-gray-400" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddNodeWithStyle('generic', 'node_location')} className="flex justify-between">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Location
                </div>
                <ChevronRight className="h-4 w-4 ml-2 text-gray-400" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAddNodeWithStyle('generic', 'node_event')} className="flex justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Event
                </div>
                <ChevronRight className="h-4 w-4 ml-2 text-gray-400" />
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
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black text-white" align="top">
            <DropdownMenuItem onClick={() => handleZoom(0.5)} className="flex justify-between">
              <span>50%</span>
              <ChevronRight className="h-4 w-4 ml-2 text-gray-400" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleZoom(1)} className="flex justify-between">
              <span>100%</span>
              <ChevronRight className="h-4 w-4 ml-2 text-gray-400" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleZoom(1.5)} className="flex justify-between">
              <span>150%</span>
              <ChevronRight className="h-4 w-4 ml-2 text-gray-400" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleZoom(2)} className="flex justify-between">
              <span>200%</span>
              <ChevronRight className="h-4 w-4 ml-2 text-gray-400" />
            </DropdownMenuItem>
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
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black text-white" align="top">
            <DropdownMenuItem onClick={() => onViewModeChange('2d')} className="flex justify-between">
              <span>2D</span>
              <ChevronRight className="h-4 w-4 ml-2 text-gray-400" />
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewModeChange('3d')} className="flex justify-between">
              <span>3D</span>
              <ChevronRight className="h-4 w-4 ml-2 text-gray-400" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Toolbar;