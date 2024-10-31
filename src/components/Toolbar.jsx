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

  const toggleAIPanel = () => {
    setIsAIPanelOpen(!isAIPanelOpen);
  };

  return (
    <>
      <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm rounded-xl shadow-lg p-0.75 border border-white/20">
        <div className="bg-black/90 rounded-xl px-1.5 py-0.5 flex items-center space-x-1 h-10">
          <ViewPerspectiveMenu 
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
          />
          
          <ToolSelectMenu 
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            viewMode={viewMode}
          />
          
          <Separator orientation="vertical" className="h-6 bg-white/20" />
          
          <ZoomLevelMenu 
            zoom={zoom}
            handleZoom={handleZoom}
          />
          
          <Separator orientation="vertical" className="h-6 bg-white/20" />
          
          <NodeStyleMenu 
            selectedStyle={selectedNodeStyle}
            onStyleChange={setSelectedNodeStyle}
          />
          
          <NodeDataMenu 
            onAddNode={handleAddNodeWithStyle}
            selectedStyle={selectedNodeStyle}
          />
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  className={`h-8 px-3 rounded-lg transition-colors flex items-center gap-1 ${
                    isAIPanelOpen 
                      ? 'bg-purple-700 text-white hover:bg-purple-800' 
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                  onClick={toggleAIPanel}
                >
                  <MessageCircle className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{isAIPanelOpen ? 'Close AI Assistant' : 'Open AI Assistant'} (⌘J)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
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