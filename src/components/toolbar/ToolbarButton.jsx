import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ToolbarButton = ({ icon: Icon, label, options, isActive, onClick, className }) => {
  if (options) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className={`h-8 w-8 rounded-lg transition-colors ${
              isActive ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-white hover:bg-white/10'
            } ${className}`}
          >
            <Icon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-black text-white" align="top">
          <DropdownMenuGroup>
            {options.map((option) => (
              <DropdownMenuItem key={option.label} onClick={() => onClick(option.value)}>
                <option.icon className="h-4 w-4 mr-2" />
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button 
      variant="ghost" 
      size="icon"
      className={`h-8 w-8 rounded-lg transition-colors ${
        isActive ? 'bg-blue-600 text-white hover:bg-blue-700' : 'text-white hover:bg-white/10'
      } ${className}`}
      onClick={onClick}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
};

export default ToolbarButton;