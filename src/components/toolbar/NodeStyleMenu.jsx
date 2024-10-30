import React from 'react';
import { Button } from "@/components/ui/button";
import { StickyNote, Square, Layout, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const NodeStyleMenu = ({ selectedStyle, onStyleChange }) => {
  const styles = [
    { id: 'postit', icon: StickyNote, label: 'Posit' },
    { id: 'default', icon: Square, label: 'Default' },
    { id: 'compact', icon: Layout, label: 'Compact' }
  ];

  const currentStyle = styles.find(style => style.id === selectedStyle) || styles[0];
  const Icon = currentStyle.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm"
          className="h-8 rounded-lg text-white hover:text-white hover:bg-white/10 bg-white/[0.0625] flex items-center gap-1.5"
        >
          <Icon className="h-4 w-4" />
          <span>{currentStyle.label}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black text-white" align="top">
        {styles.map(style => (
          <DropdownMenuItem 
            key={style.id}
            onClick={() => onStyleChange(style.id)}
            className="flex items-center gap-2 hover:text-white"
          >
            <style.icon className="h-4 w-4" />
            <span>{style.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NodeStyleMenu;