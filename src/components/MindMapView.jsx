import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, Hand, Sparkles, Square, StickyNote, Image, Type, Link, Layers, ToggleLeft, ZoomIn, ZoomOut, Download } from 'lucide-react';

const MindMapView = ({ project, focusedDocument }) => {
  const [showAIInput, setShowAIInput] = useState(false);

  const handleAIClick = () => {
    setShowAIInput(!showAIInput);
  };

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
      {showAIInput && (
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
      )}
      <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg p-2 flex items-center space-x-2">
        <Button size="icon" variant="ghost" className="rounded-full">
          <PlusIcon className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="rounded-full">
          <Hand className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="rounded-full" onClick={handleAIClick}>
          <Sparkles className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="rounded-full">
          <Square className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="rounded-full">
          <StickyNote className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="rounded-full">
          <Image className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="rounded-full">
          <Type className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="rounded-full">
          <Link className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="rounded-full">
          <Layers className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="ghost" className="rounded-full">
          <ToggleLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">2D</span>
        <Button size="icon" variant="ghost" className="rounded-full">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">100%</span>
        <Button size="icon" variant="ghost" className="rounded-full">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="ghost" className="rounded-full px-4">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
};

export default MindMapView;