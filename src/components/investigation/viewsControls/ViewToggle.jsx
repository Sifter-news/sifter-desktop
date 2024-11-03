import React from 'react';
import { Button } from "@/components/ui/button";
import { Settings2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ViewToggle = ({ currentView, onViewChange }) => {
  const views = {
    '2d': '2D View',
    '3d': '3D View',
    'flat': 'Flat View'
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings2 className="h-4 w-4" />
          {views[currentView]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {Object.entries(views).map(([key, label]) => (
          <DropdownMenuItem
            key={key}
            onClick={() => onViewChange(key)}
            className={currentView === key ? 'bg-accent' : ''}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ViewToggle;