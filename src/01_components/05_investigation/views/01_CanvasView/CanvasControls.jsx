import React from 'react';
import { Separator } from "@/components/ui/separator";
import { MousePointer2, ZoomIn, ZoomOut, RotateCcw, MessageCircle, GitBranch } from 'lucide-react';
import ToolbarButton from './components/toolbar/ToolbarButton';
import NodeDropdown from './components/toolbar/NodeDropdown';

const CanvasControls = ({ 
  activeTool, 
  setActiveTool, 
  zoom,
  handleZoom,
  onAIChatToggle,
  isAIChatOpen,
  onAddNode
}) => {
  const zoomIn = () => handleZoom(0.1);
  const zoomOut = () => handleZoom(-0.1);
  const resetZoom = () => handleZoom(1 - zoom);

  const handleDragStart = (e, visualStyle) => {
    e.dataTransfer.setData('visualStyle', visualStyle);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleConnectionDragStart = (e) => {
    e.dataTransfer.setData('connectionType', 'default');
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleAddNode = (visualStyle) => {
    onAddNode({
      title: 'New Node',
      description: '',
      visualStyle,
      color: 'bg-white',
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });
  };

  return (
    <div className={`fixed bottom-4 transition-all duration-300 ${isAIChatOpen ? 'right-[376px]' : 'right-4'} bg-black/90 backdrop-blur-sm rounded-xl shadow-lg p-0.75 border border-white/20`}>
      <div className="bg-black/90 rounded-xl px-1.5 py-2 flex flex-col items-center space-y-2">
        <ToolbarButton
          icon={MousePointer2}
          label="Select"
          shortcut="V"
          isActive={activeTool === 'select'}
          onClick={() => setActiveTool('select')}
        />

        <ToolbarButton
          icon={GitBranch}
          label="Drag to add Connection"
          draggable
          onDragStart={handleConnectionDragStart}
        />

        <NodeDropdown 
          onAddNode={handleAddNode}
          handleDragStart={handleDragStart}
        />

        <Separator className="w-6 bg-white/20" />

        <ToolbarButton
          icon={ZoomIn}
          label="Zoom In"
          shortcut="⌘+"
          onClick={zoomIn}
        />

        <ToolbarButton
          icon={ZoomOut}
          label="Zoom Out"
          shortcut="⌘-"
          onClick={zoomOut}
        />

        <ToolbarButton
          icon={RotateCcw}
          label="Reset Zoom"
          shortcut="⌘0"
          onClick={resetZoom}
        />

        <Separator className="w-6 bg-white/20" />

        <ToolbarButton
          icon={MessageCircle}
          label="AI Assistant"
          shortcut="⌘J"
          isActive={isAIChatOpen}
          onClick={onAIChatToggle}
          className={isAIChatOpen ? 'bg-purple-600 text-white' : ''}
        />
      </div>
    </div>
  );
};

export default CanvasControls;