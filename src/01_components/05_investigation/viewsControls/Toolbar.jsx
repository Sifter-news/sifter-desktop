import React from 'react';
import { Separator } from "@/components/ui/separator";
import ViewToggle from './ViewToggle';
import { Button } from "@/components/ui/button";
import { MessageCircle, Plus } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Toolbar = ({ 
  viewMode,
  onViewModeChange,
  onAIChatToggle,
  onAddNode
}) => {
  return (
    <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm rounded-xl shadow-lg p-0.75 border border-white/20">
      <div className="bg-black/90 rounded-xl px-1.5 py-0.5 flex items-center space-x-1 h-10">
        <ViewToggle 
          currentView={viewMode}
          onViewChange={onViewModeChange}
        />
        
        <Separator orientation="vertical" className="h-6 bg-white/20" />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 rounded-lg text-white hover:bg-white/10"
                onClick={onAddNode}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Add Node</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="h-6 bg-white/20" />

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 rounded-lg text-white hover:bg-white/10"
                onClick={onAIChatToggle}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">AI Assistant</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Toolbar;