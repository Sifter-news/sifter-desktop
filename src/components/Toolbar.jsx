import React, { useState } from 'react';
import { Separator } from "@/components/ui/separator";
import { MessageCircle } from 'lucide-react';
import ToolSelectMenu from './toolbar/ToolSelectMenu';
import ViewPerspectiveMenu from './toolbar/ViewPerspectiveMenu';
import ZoomLevelMenu from './toolbar/ZoomLevelMenu';
import NodeStyleMenu from './toolbar/NodeStyleMenu';
import NodeDataMenu from './toolbar/NodeDataMenu';
import AIChatPanel from './ai/AIChatPanel';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const Toolbar = ({ 
  activeTool, 
  setActiveTool, 
  handleZoom, 
  zoom, 
  viewMode,
  onViewModeChange,
  onAddNode,
  isSpacePressed 
}) => {
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [selectedNodeStyle, setSelectedNodeStyle] = useState('postit');
  
  const handleAddNodeWithStyle = (nodeType) => {
    const newNode = {
      nodeType,
      visualStyle: selectedNodeStyle,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      z: 0,
      title: 'New Node',
      description: ''
    };
    onAddNode?.(newNode);
  };

  return (
    <>
      <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-black rounded-xl shadow-lg p-4 border border-white/20">
        <div className="bg-black rounded-xl px-4 py-2 flex items-end space-x-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-white/80">View</span>
            <ViewPerspectiveMenu 
              viewMode={viewMode}
              onViewModeChange={onViewModeChange}
            />
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-white/80">Tool</span>
            <ToolSelectMenu 
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              viewMode={viewMode}
            />
          </div>
          
          <Separator orientation="vertical" className="h-8 bg-white/20" />
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-white/80">Zoom</span>
            <ZoomLevelMenu 
              zoom={zoom}
              handleZoom={handleZoom}
            />
          </div>
          
          <Separator orientation="vertical" className="h-8 bg-white/20" />
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-white/80">Style</span>
            <NodeStyleMenu 
              selectedStyle={selectedNodeStyle}
              onStyleChange={setSelectedNodeStyle}
            />
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-white/80">Add</span>
            <NodeDataMenu 
              onAddNode={handleAddNodeWithStyle}
              selectedStyle={selectedNodeStyle}
            />
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs text-white/80">AI</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className="h-8 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white hover:text-white flex items-center gap-1"
                    onClick={() => setIsAIPanelOpen(true)}
                  >
                    <MessageCircle className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>AI Assistant (⌘J)</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <AIChatPanel 
        isOpen={isAIPanelOpen}
        onClose={() => setIsAIPanelOpen(false)}
        title="Sift Assist"
        placeholder="Ask me anything about your investigation..."
      />
    </>
  );
};

export default Toolbar;