import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown } from 'lucide-react';
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

const colors = {
  white: { label: 'White', class: 'bg-white' },
  yellow: { label: 'Yellow', class: 'bg-yellow-100' },
  blue: { label: 'Blue', class: 'bg-blue-100' },
  green: { label: 'Green', class: 'bg-green-100' },
  pink: { label: 'Pink', class: 'bg-pink-100' },
  purple: { label: 'Purple', class: 'bg-purple-100' },
  orange: { label: 'Orange', class: 'bg-orange-100' },
};

const ColorMenu = ({ currentColor, onColorChange, isOpen, setIsOpen }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-7 px-2">
                <div className={`w-4 h-4 rounded-full ${currentColor}`} />
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <PopoverContent className="w-32">
            <div className="flex flex-col space-y-0.5">
              {Object.entries(colors).map(([key, { label, class: bgClass }]) => (
                <Button
                  key={key}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onColorChange(bgClass);
                    setIsOpen(false);
                  }}
                  className="justify-start h-7"
                >
                  <div className={`w-4 h-4 rounded-full mr-2 ${bgClass}`} />
                  {label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <TooltipContent side="top">
          <p>Change Color</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ColorMenu;