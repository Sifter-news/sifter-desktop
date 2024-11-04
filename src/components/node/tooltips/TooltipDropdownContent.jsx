import React from 'react';
import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

const TooltipDropdownContent = ({ items, onSelect, currentValue }) => {
  return (
    <DropdownMenuContent className="bg-black text-white border-white/10">
      {items.map(({ key, label, value, icon: Icon }) => (
        <DropdownMenuItem 
          key={key || value}
          onClick={() => onSelect(value)}
          className={`${currentValue === value ? 'bg-white/10' : ''} hover:bg-white/20`}
        >
          {Icon && <Icon className="h-6 w-6 mr-2" />}
          {label}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  );
};

export default TooltipDropdownContent;