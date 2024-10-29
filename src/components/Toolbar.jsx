import React from 'react';
import { Plus, ChevronDown, MessageCircle, Square } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ToolSelectMenu from './toolbar/ToolSelectMenu';
import AIChatPanel from './ai/AIChatPanel';

const Toolbar = ({ 
  activeTool, 
  setActiveTool, 
  viewMode,
  onViewModeChange,
  onAddNode 
}) => {
  const [isAIPanelOpen, setIsAIPanelOpen] = React.useState(false);

  const handleAddNode = (style, type = 'generic') => {
    const nodeTypes = {
      'generic': 'Generic Note',
      'node_person': 'Person',
      'node_organization': 'Organization',
      'node_object': 'Object',
      'node_concept': 'Concept',
      'node_location': 'Location',
      'node_event': 'Event'
    };

    onAddNode({
      title: `New ${nodeTypes[type]}`,
      visualStyle: style,
      nodeType: type,
      geometry: 'plane',
      dimensions: {
        width: style === 'compact' ? 4 : style === 'postit' ? 8 : 6,
        height: style === 'compact' ? 4 : style === 'postit' ? 8 : 3,
        depth: 0.1
      }
    });
  };

  return (
    <>
      <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur-sm rounded-xl shadow-lg p-0.75 border border-white/20">
        <div className="bg-black/90 rounded-xl px-1.5 py-0.5 flex items-center h-10">
          <ToolSelectMenu 
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            viewMode={viewMode}
            setViewMode={onViewModeChange}
          />

          <Separator orientation="vertical" className="h-6 bg-white/20 mx-2" />

          <div className="flex-grow" />

          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 rounded-lg text-white hover:bg-white/40 bg-white/30 [&>svg]:text-white hover:[&>svg]:text-white"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black text-white" align="top">
                <DropdownMenuItem onClick={() => handleAddNode('postit', 'generic')}>
                  <Square className="h-4 w-4 mr-2" />
                  Post-it Note
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddNode('default', 'node_person')}>
                  <Square className="h-4 w-4 mr-2" />
                  Person Note
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddNode('default', 'node_organization')}>
                  <Square className="h-4 w-4 mr-2" />
                  Organization Note
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddNode('default', 'node_object')}>
                  <Square className="h-4 w-4 mr-2" />
                  Object Note
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddNode('default', 'node_concept')}>
                  <Square className="h-4 w-4 mr-2" />
                  Concept Note
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddNode('default', 'node_location')}>
                  <Square className="h-4 w-4 mr-2" />
                  Location Note
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddNode('default', 'node_event')}>
                  <Square className="h-4 w-4 mr-2" />
                  Event Note
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button 
              variant="ghost" 
              size="icon"
              className="h-8 w-8 rounded-lg bg-white hover:bg-white/90 text-black flex items-center gap-0.5"
              onClick={() => setIsAIPanelOpen(true)}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <AIChatPanel 
        isOpen={isAIPanelOpen}
        onClose={() => setIsAIPanelOpen(false)}
        title="AI Assistant"
        placeholder="Ask me anything about your investigation..."
      />
    </>
  );
};

export default Toolbar;