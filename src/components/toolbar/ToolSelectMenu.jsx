import React from 'react';
import { Button } from "@/components/ui/button";
import { MousePointer2, Move3d, Orbit, MessageCircle, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ToolSelectMenu = ({ activeTool, setActiveTool, viewMode }) => {
  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select', shortcut: 'V' },
    { id: 'pan', icon: viewMode === '3d' ? Orbit : Move3d, label: viewMode === '3d' ? 'Pan & Orbit' : 'Pan', shortcut: 'H' },
    { id: 'comment', icon: MessageCircle, label: 'Comment', shortcut: 'C' }
  ];

  const currentTool = tools.find(tool => tool.id === activeTool) || tools[0];
  const Icon = currentTool.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 rounded-lg bg-blue-600 hover:bg-blue-700 text-white hover:text-white flex items-center gap-1.5"
              >
                <Icon className="h-4 w-4" />
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <DropdownMenuContent className="bg-black text-white" align="top">
            {tools.map(tool => (
              <DropdownMenuItem 
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className="flex items-center justify-between hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <tool.icon className="h-4 w-4" />
                  <span>{tool.label}</span>
                </div>
                <span className="text-xs text-gray-400">{tool.shortcut}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent side="bottom">
          <p>Select Tool ({currentTool.shortcut})</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ToolSelectMenu;