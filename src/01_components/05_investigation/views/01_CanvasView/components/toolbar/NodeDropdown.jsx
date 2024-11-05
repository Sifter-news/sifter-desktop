import React from 'react';
import { StickyNote, FileText, Layout } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ToolbarButton from './ToolbarButton';

const nodeStyles = {
  postit: { label: "Post-it", icon: StickyNote },
  default: { label: "Default", icon: FileText },
  compact: { label: "Compact", icon: Layout }
};

const NodeDropdown = ({ onAddNode, handleDragStart }) => {
  const defaultStyle = 'postit';
  const DefaultIcon = nodeStyles[defaultStyle].icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <ToolbarButton
            icon={DefaultIcon}
            label="Add Node"
            shortcut="(N)"
          />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black/90 text-white border border-white/20">
        {Object.entries(nodeStyles).map(([style, { label, icon: Icon }]) => (
          <DropdownMenuItem
            key={style}
            onClick={() => onAddNode(style)}
            draggable
            onDragStart={(e) => handleDragStart(e, style)}
            className="cursor-grab"
          >
            <Icon className="h-4 w-4 mr-2" />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NodeDropdown;