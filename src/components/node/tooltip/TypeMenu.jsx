import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  FileText,
  User,
  Building2,
  Box,
  Brain,
  MapPin,
  Calendar,
  ChevronDown 
} from 'lucide-react';
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

const nodeTypes = {
  generic: { label: 'Note', icon: FileText },
  node_person: { label: 'Person', icon: User },
  node_organization: { label: 'Organization', icon: Building2 },
  node_object: { label: 'Object', icon: Box },
  node_concept: { label: 'Concept', icon: Brain },
  node_location: { label: 'Location', icon: MapPin },
  node_event: { label: 'Event', icon: Calendar }
};

const TypeMenu = ({ currentType, onTypeChange, isOpen, setIsOpen }) => {
  const CurrentTypeIcon = nodeTypes[currentType]?.icon || FileText;

  return (
    <TooltipProvider>
      <Tooltip>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 h-7 px-2">
                <CurrentTypeIcon className="h-4 w-4" />
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <PopoverContent className="w-40">
            <div className="flex flex-col space-y-0.5">
              {Object.entries(nodeTypes).map(([key, { label, icon: Icon }]) => (
                <Button
                  key={key}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onTypeChange(key);
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
          <p>Change Type</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TypeMenu;