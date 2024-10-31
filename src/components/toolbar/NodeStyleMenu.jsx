import React from 'react';
import { Button } from "@/components/ui/button";
import { StickyNote, Square, Layout, ChevronDown } from 'lucide-react';
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

const NodeStyleMenu = ({ selectedStyle, onStyleChange }) => {
  const styles = [
    { id: 'postit', icon: StickyNote, label: 'Posit' },
    { id: 'default', icon: Square, label: 'Default' },
    { id: 'compact', icon: Layout, label: 'Compact' }
  ];

  const currentStyle = styles.find(style => style.id === selectedStyle) || styles[0];
  const Icon = currentStyle.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 rounded-lg text-white hover:text-white hover:bg-white/10 bg-white/[0.0625]"
              >
                <Icon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <DropdownMenuContent className="bg-black text-white" align="top">
            {styles.map(style => (
              <DropdownMenuItem 
                key={style.id}
                onClick={() => onStyleChange(style.id)}
                className="flex items-center justify-center hover:text-white"
              >
                <style.icon className="h-4 w-4" />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <TooltipContent side="top" className="bg-black text-white border-white/10">
          <p>Node Style</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NodeStyleMenu;