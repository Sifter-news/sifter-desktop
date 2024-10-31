import React from 'react';
import { Button } from "@/components/ui/button";
import { Grid2x2, Axis3D, ChevronDown } from 'lucide-react';
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

const ViewPerspectiveMenu = ({ viewMode, onViewModeChange }) => {
  const views = [
    { id: '2d', icon: Grid2x2, label: '2D View', shortcut: '2' },
    { id: '3d', icon: Axis3D, label: '3D View', shortcut: '3' }
  ];

  const currentView = views.find(view => view.id === viewMode) || views[0];
  const Icon = currentView.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 rounded-lg bg-gray-700 hover:bg-gray-600 text-white hover:text-white flex items-center gap-1.5"
              >
                <Icon className="h-4 w-4" />
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <DropdownMenuContent className="bg-black text-white" align="top">
            {views.map(view => (
              <DropdownMenuItem 
                key={view.id}
                onClick={() => onViewModeChange(view.id)}
                className="flex items-center justify-between hover:text-white"
              >
                <div className="flex items-center gap-2">
                  <view.icon className="h-4 w-4" />
                  <span>{view.label}</span>
                </div>
                <span className="text-xs text-gray-400">{view.shortcut}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent side="top" className="bg-black text-white border-white/10">
          <p>Switch View Mode ({currentView.shortcut})</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ViewPerspectiveMenu;