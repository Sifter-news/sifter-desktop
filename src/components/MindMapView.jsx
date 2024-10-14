import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from 'lucide-react';

const MindMapView = ({ project }) => {
  return (
    <div className="bg-[#594BFF] min-h-[calc(100vh-120px)] relative flex items-center justify-center">
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      ></div>
      <div className="bg-white rounded-full shadow-lg p-2 flex items-center space-x-2 max-w-xl w-full">
        <Button size="icon" className="rounded-full flex-shrink-0">
          <PlusIcon className="h-6 w-6" />
        </Button>
        <Input 
          type="text" 
          placeholder="Ask anything about this project" 
          className="flex-grow text-lg border-none focus:ring-0 rounded-full"
        />
        <Button className="bg-blue-500 hover:bg-blue-600 text-white rounded-full px-6">
          Ask
        </Button>
      </div>
    </div>
  );
};

export default MindMapView;