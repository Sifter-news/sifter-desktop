import React from 'react';
import { Button } from "@/components/ui/button";
import { Layout, Square, StickyNote, ChevronDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const styles = {
  compact: { label: 'Compact', icon: Layout },
  default: { label: 'Default', icon: Square },
  postit: { label: 'Post-it', icon: StickyNote }
};

const StyleMenu = ({ currentStyle, onStyleChange, isOpen, setIsOpen }) => {
  const CurrentStyleIcon = styles[currentStyle]?.icon || Square;

  return (
    <TooltipProvider>
      <Tooltip>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-7 px-2">
                <CurrentStyleIcon className="h-4 w-4" />
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <PopoverContent className="w-32">
            <div className="flex flex-col space-y-0.5">
              {Object.entries(styles).map(([key, { label, icon: Icon }]) => (
                <Button
                  key={key}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onStyleChange(key);
                    setIsOpen(false);
                  }}
                  className="justify-start h-7"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <TooltipContent side="top">
          <p>Change Style</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default StyleMenu;