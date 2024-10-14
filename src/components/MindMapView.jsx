import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, Hand, Sparkles, Square, StickyNote, Image, Type, Link, Layers, ToggleLeft, ZoomIn, ZoomOut, Download, MousePointer } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MindMapView = ({ project, focusedDocument }) => {
  const [showAIInput, setShowAIInput] = useState(false);

  const handleAIClick = () => {
    setShowAIInput(!showAIInput);
  };

  const ToolButton = ({ icon, label, onClick }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon" variant="ghost" className="rounded-full" onClick={onClick}>
            {icon}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <div className="bg-[#594BFF] min-h-[calc(100vh-120px)] relative flex items-center justify-center">
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      ></div>
      {showAIInput && (
        <div className="bg-white rounded-full shadow-lg p-2 flex items-center space-x-2 max-w-xl w-full">
          <Button size="icon" className="rounded-full flex-shrink-0">
            <PlusIcon className="h-6 w-6" />
          </Button>
          <Input 
            type="text" 
            placeholder="Ask anything about this project" 
            className="flex-grow text-lg border-none focus:ring-0 rounded-full"
          />
          <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6">
            Ask
          </Button>
        </div>
      )}
      <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg p-2 flex items-center space-x-2">
        <ToolButton icon={<MousePointer className="h-4 w-4" />} label="Select" />
        <ToolButton icon={<Hand className="h-4 w-4" />} label="Pan" />
        <ToolButton icon={<Sparkles className="h-4 w-4" />} label="AI Node" onClick={handleAIClick} />
        <ToolButton icon={<Square className="h-4 w-4" />} label="Blank Node" />
        <ToolButton icon={<StickyNote className="h-4 w-4" />} label="Post-it Node" />
        <ToolButton icon={<Image className="h-4 w-4" />} label="Document/Image Node" />
        <ToolButton icon={<Type className="h-4 w-4" />} label="Text Tool" />
        <ToolButton icon={<Link className="h-4 w-4" />} label="Connector Node" />
        <ToolButton icon={<Layers className="h-4 w-4" />} label="Grouped Section Node" />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center space-x-1">
                <Button size="icon" variant="ghost" className="rounded-full">
                  <ToggleLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">2D</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle 2D/3D View</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <ToolButton icon={<ZoomIn className="h-4 w-4" />} label="Zoom In" />
        <span className="text-sm font-medium">100%</span>
        <ToolButton icon={<ZoomOut className="h-4 w-4" />} label="Zoom Out" />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="rounded-full px-4">
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
    </div>
  );
};

export default MindMapView;