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
  white: { label: 'White', class: 'bg-white border border-gray-200' },
  yellow: { label: 'Yellow', class: 'bg-yellow-100 border border-yellow-200' },
  blue: { label: 'Blue', class: 'bg-blue-100 border border-blue-200' },
  green: { label: 'Green', class: 'bg-green-100 border border-green-200' },
  pink: { label: 'Pink', class: 'bg-pink-100 border border-pink-200' },
  purple: { label: 'Purple', class: 'bg-purple-100 border border-purple-200' },
  orange: { label: 'Orange', class: 'bg-orange-100 border border-orange-200' },
};

const ColorMenu = ({ currentColor, onColorChange, isOpen, setIsOpen }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-7 px-2">
                <div className={`w-4 h-4 rounded-full ${currentColor} border border-gray-200`} />
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <PopoverContent className="w-32 bg-white p-1">
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
                  className="justify-start h-7 hover:bg-gray-100"
                >
                  <div className={`w-4 h-4 rounded-full mr-2 ${bgClass}`} />
                  <span className="text-gray-700">{label}</span>
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <TooltipContent side="top" className="bg-black text-white">
          <p>Change Color</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ColorMenu;