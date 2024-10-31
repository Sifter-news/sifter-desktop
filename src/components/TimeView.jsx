import React, { useState } from 'react';
import { format } from 'date-fns';
import { Plus, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button";
import NodeTooltip from './node/NodeTooltip';
import UnifiedNodeEditModal from './node/UnifiedNodeEditModal';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from 'sonner';

const TimeView = ({ nodes, onUpdateNode, focusedNodeId, onNodeFocus, onAddNode }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const sortedNodes = [...nodes]
    .filter(node => node.nodeType === 'node_event' || node.type === 'node_event')
    .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

  const handleNodeClick = (node) => {
    onNodeFocus(node.id);
    setSelectedNode(node);
  };

  const handleAddEventNode = (x) => {
    if (typeof onAddNode !== 'function') {
      console.error('onAddNode is not a function');
      return;
    }

    const newNode = {
      id: Date.now().toString(),
      title: 'New Event',
      description: '',
      type: 'node_event',
      nodeType: 'node_event',
      visualStyle: 'compact',
      x: x,
      y: 200,
      width: 200,
      height: 100,
      timestamp: new Date().toISOString()
    };

    onAddNode(newNode);
    toast.success('Event added to timeline');
  };

  return (
    <div className="min-h-[calc(100vh-120px)] p-8 relative flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
        <div className="relative">
          <div className="absolute top-5 left-5 w-[calc(100%-40px)] h-1 bg-blue-200"></div>
          <div className="flex justify-between">
            {sortedNodes.map((node, index) => (
              <TooltipProvider key={node.id}>
                <Tooltip>
                  <TooltipTrigger>
                    <div 
                      className={`relative flex flex-col items-center cursor-pointer transition-all duration-200 ${
                        focusedNodeId === node.id ? 'scale-110 shadow-lg' : ''
                      }`}
                      onClick={() => handleNodeClick(node)}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                        focusedNodeId === node.id 
                          ? 'bg-blue-600 ring-4 ring-blue-200' 
                          : 'bg-blue-500 hover:bg-blue-600'
                      }`}>
                        <Calendar className="h-5 w-5 text-white" />
                      </div>
                      <div className="mt-2 text-center">
                        <div className={`font-semibold transition-colors ${
                          focusedNodeId === node.id ? 'text-blue-600' : 'hover:text-blue-500'
                        }`}>
                          {node.title}
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-sm">
                      <div className="font-medium">{node.title}</div>
                      <div className="text-gray-500">
                        {node.timestamp 
                          ? format(new Date(node.timestamp), 'PPP p')
                          : 'No date set'}
                      </div>
                      {node.description && (
                        <div className="mt-1 max-w-xs">{node.description}</div>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex items-center gap-2"
            onClick={() => handleAddEventNode(sortedNodes.length * 250)}
          >
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>
      <UnifiedNodeEditModal 
        isOpen={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        node={selectedNode}
        onUpdate={onUpdateNode}
        onDelete={() => {
          onDelete(selectedNode.id);
          setSelectedNode(null);
        }}
      />
    </div>
  );
};

export default TimeView;