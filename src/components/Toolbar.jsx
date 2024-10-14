import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { MousePointer2, Hand, PlusCircle, TextCursor, StickyNote, GitCommit, Bot } from 'lucide-react';
import ToolbarButton from './ToolbarButton';
import { useDarkMode } from '../contexts/DarkModeContext';

const Toolbar = ({ activeTool, setActiveTool, handleAIClick, handleAddNode, handleZoom, zoom }) => {
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`fixed bottom-0 left-0 right-0 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-center space-x-4">
          <ToolbarButton
            icon={<MousePointer2 className={activeTool === 'select' ? 'text-blue-500' : ''} />}
            label="Select"
            onClick={() => setActiveTool('select')}
          />
          <ToolbarButton
            icon={<Hand className={activeTool === 'pan' ? 'text-blue-500' : ''} />}
            label="Pan"
            onClick={() => setActiveTool('pan')}
          />
          <ToolbarButton
            icon={<PlusCircle />}
            label="Add Blank"
            onClick={() => handleAddNode('blank')}
          />
          <ToolbarButton
            icon={<TextCursor />}
            label="Add Text"
            onClick={() => handleAddNode('text')}
          />
          <ToolbarButton
            icon={<StickyNote />}
            label="Add Post-it"
            onClick={() => handleAddNode('postit')}
          />
          <ToolbarButton
            icon={<GitCommit />}
            label="Add Connector"
            onClick={() => handleAddNode('connector')}
          />
          <ToolbarButton
            icon={<Bot />}
            label="AI Assistant"
            onClick={handleAIClick}
          />
          <div className="flex items-center space-x-2">
            <Button size="icon" variant="outline" onClick={() => handleZoom(zoom - 0.1)}>-</Button>
            <Slider
              value={[zoom]}
              onValueChange={([value]) => handleZoom(value)}
              min={0.1}
              max={2}
              step={0.1}
              className="w-32"
            />
            <Button size="icon" variant="outline" onClick={() => handleZoom(zoom + 0.1)}>+</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;