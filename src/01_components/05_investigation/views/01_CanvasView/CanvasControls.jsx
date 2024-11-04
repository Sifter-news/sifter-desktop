import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MousePointer2, ZoomIn, ZoomOut, RotateCcw, MessageCircle, GitBranch, FileText, User, Building2, Package, Brain, MapPin, Calendar } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const nodeTypes = {
  generic: { label: "Note", icon: FileText },
  node_person: { label: "Person", icon: User },
  node_organization: { label: "Organization", icon: Building2 },
  node_object: { label: "Object", icon: Package },
  node_concept: { label: "Concept", icon: Brain },
  node_location: { label: "Location", icon: MapPin },
  node_event: { label: "Event", icon: Calendar }
};

const CanvasControls = ({ 
  activeTool, 
  setActiveTool, 
  zoom,
  handleZoom,
  onAIChatToggle,
  isAIChatOpen,
  onAddNode
}) => {
  const zoomIn = () => handleZoom(0.1);
  const zoomOut = () => handleZoom(-0.1);
  const resetZoom = () => handleZoom(1 - zoom);

  const handleDragStart = (e, nodeType) => {
    e.dataTransfer.setData('nodeType', nodeType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleConnectionDragStart = (e) => {
    e.dataTransfer.setData('connectionType', 'default');
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className={`fixed bottom-4 transition-all duration-300 ${isAIChatOpen ? 'right-[376px]' : 'right-4'} bg-black/90 backdrop-blur-sm rounded-xl shadow-lg p-0.75 border border-white/20`}>
      <div className="bg-black/90 rounded-xl px-1.5 py-2 flex flex-col items-center space-y-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-lg ${
                  activeTool === 'select' ? 'bg-blue-600 text-white' : 'text-white hover:bg-white/10'
                }`}
                onClick={() => setActiveTool('select')}
              >
                <MousePointer2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Select (V)</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-white hover:bg-white/10"
                draggable
                onDragStart={handleConnectionDragStart}
              >
                <GitBranch className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Drag to add Connection</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg text-white hover:bg-white/10"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="left">Drag to add Node (N)</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenuContent className="bg-black/90 text-white border border-white/20">
            {Object.entries(nodeTypes).map(([type, { label, icon: Icon }]) => (
              <DropdownMenuItem
                key={type}
                draggable
                onDragStart={(e) => handleDragStart(e, type)}
                className="cursor-grab"
              >
                <Icon className="h-4 w-4 mr-2" />
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator className="w-6 bg-white/20" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-white hover:bg-white/10"
                onClick={zoomIn}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Zoom In (⌘+)</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-white hover:bg-white/10"
                onClick={zoomOut}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Zoom Out (⌘-)</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-white hover:bg-white/10"
                onClick={resetZoom}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Reset Zoom (⌘0)</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator className="w-6 bg-white/20" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-lg ${
                  isAIChatOpen ? 'bg-purple-600 text-white' : 'text-white hover:bg-white/10'
                }`}
                onClick={onAIChatToggle}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">AI Assistant (⌘J)</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default CanvasControls;