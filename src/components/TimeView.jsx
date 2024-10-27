import React, { useState } from 'react';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import ReportList from './ReportList';
import NodeTooltip from './node/NodeTooltip';
import NodeEditorModal from './node/NodeEditorModal';
import { toast } from 'sonner';

const TimeView = ({ project, nodes, reports, onAddReport, onUpdateReport, onUpdateNode, focusedNodeId, onNodeFocus, onAddNode }) => {
  const [selectedNode, setSelectedNode] = useState(null);
  const sortedNodes = [...nodes].sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

  const handleNodeClick = (node) => {
    onNodeFocus(node.id);
    setSelectedNode(node);
  };

  const handleAddEventNode = (x) => {
    const newNode = {
      id: Date.now().toString(),
      title: 'New Event',
      description: '',
      type: 'node_event',
      nodeType: 'node_event',
      x: x,
      y: 200, // Fixed vertical position for timeline
      width: 200,
      height: 100,
      timestamp: new Date().toISOString()
    };

    onAddNode(newNode);
    toast.success('Event node added');
  };

  return (
    <div className="min-h-[calc(100vh-120px)] p-8 relative flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl">
        <div className="relative">
          <div className="absolute top-5 left-5 w-[calc(100%-40px)] h-1 bg-blue-200"></div>
          <div className="flex justify-between">
            {sortedNodes.map((node, index) => (
              <NodeTooltip key={node.id} node={node} onView={handleNodeClick}>
                <div 
                  className={`relative flex flex-col items-center cursor-pointer transition-all duration-200 ${
                    focusedNodeId === node.id ? 'scale-110 shadow-lg' : ''
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                    focusedNodeId === node.id 
                      ? 'bg-blue-600 ring-4 ring-blue-200' 
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}>
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <div className="mt-2 text-center">
                    <div className={`font-semibold transition-colors ${
                      focusedNodeId === node.id ? 'text-blue-600' : 'hover:text-blue-500'
                    }`}>
                      {node.title}
                    </div>
                    <div className="text-sm text-gray-500">
                      {node.timestamp 
                        ? format(new Date(node.timestamp), 'yyyy-MM-dd HH:mm')
                        : 'No timestamp'}
                    </div>
                  </div>
                </div>
              </NodeTooltip>
            ))}
          </div>
          
          {/* Add Event Node Button */}
          <Button
            variant="outline"
            size="sm"
            className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex items-center gap-2"
            onClick={() => handleAddEventNode(sortedNodes.length * 250)} // Space nodes horizontally
          >
            <Plus className="h-4 w-4" />
            Add Event
          </Button>
        </div>
      </div>
      <NodeEditorModal 
        isOpen={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        node={selectedNode}
        onUpdate={onUpdateNode}
      />
    </div>
  );
};

export default TimeView;