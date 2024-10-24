import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight } from 'lucide-react';

const Navigator = ({ items, setItems, onNodeClick, focusedNode }) => {
  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="space-y-1">
        {items.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={`w-full justify-start ${
              focusedNode?.id === item.id ? 'bg-accent' : ''
            }`}
            onClick={() => onNodeClick(item)}
          >
            <ChevronRight className="h-4 w-4 mr-2" />
            {item.title}
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default Navigator;