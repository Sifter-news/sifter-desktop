import React from 'react';
import { Plus, ChevronDown, MessageCircle, File, Folder } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ToolSelectMenu from './toolbar/ToolSelectMenu';
import AIChatPanel from './ai/AIChatPanel';

const Toolbar = ({ 
  activeTool, 
  setActiveTool, 
  handleZoom, 
  zoom, 
  viewMode,
  setViewMode,
  onAddNode 
}) => {
  const [isAIPanelOpen, setIsAIPanelOpen] = React.useState(false);
  const zoomPercentage = Math.round(100 - (zoom / 2));

  return (
    <>
      <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm rounded-xl shadow-lg p-0.75 border border-white/20">
        <div className="bg-black/90 rounded-xl px-1.5 py-0.5 flex items-center space-x-2 h-10">
          <ToolSelectMenu 
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          <Separator orientation="vertical" className="h-6 bg-white/20" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 rounded-lg text-white hover:bg-white/10 bg-white/[0.0625] flex items-center gap-1 [&>svg]:text-white hover:[&>svg]:text-white"
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

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 rounded-lg text-white hover:bg-white/10 bg-white/[0.0625] [&>svg]:text-white hover:[&>svg]:text-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black text-white" align="top">
                <DropdownMenuItem onClick={() => onAddNode('postit')}>
                  <File className="h-4 w-4 mr-2" />
                  Post-it Note
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddNode('default')}>
                  <File className="h-4 w-4 mr-2" />
                  Default Note
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAddNode('compact')}>
                  <Folder className="h-4 w-4 mr-2" />
                  Compact Note
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 rounded-lg bg-white/50 hover:bg-white/60 text-black flex items-center gap-0.5"
              onClick={() => setIsAIPanelOpen(true)}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <AIChatPanel 
        isOpen={isAIPanelOpen}
        onClose={() => setIsAIPanelOpen(false)}
        title="AI Assistant"
        placeholder="Ask me anything about your investigation..."
      />
    </>
  );
};

export default Toolbar;