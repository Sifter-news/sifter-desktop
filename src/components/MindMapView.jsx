import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from 'lucide-react';
import { saveProjectState, loadProjectState } from '../utils/projectUtils';
import { useZoomPan, findAvailablePosition, snapToGrid } from '../utils/canvasUtils';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import AISidePanel from './AISidePanel';
import ReportList from './ReportList';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MindMapView = ({ project, nodes, setNodes, onAddNode, onUpdateNode, onDeleteNode, reports, onAddReport, onUpdateReport }) => {
  const [activeTool, setActiveTool] = useState('select');
  const [focusedNodeId, setFocusedNodeId] = useState(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [initialAIMessage, setInitialAIMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNodeType, setDraggedNodeType] = useState(null);
  const canvasRef = useRef(null);

  const {
    zoom,
    position,
    handleZoom,
    handlePanStart,
    handlePanMove,
    handlePanEnd,
  } = useZoomPan();

  useEffect(() => {
    const savedNodes = loadProjectState(project.id);
    if (savedNodes.length > 0) {
      setNodes(savedNodes);
    }
  }, [project.id, setNodes]);

  useEffect(() => {
    saveProjectState(project.id, nodes);
  }, [project.id, nodes]);

  const handleNodeClick = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (node && node.type === 'blank') {
      setSidePanelOpen(true);
      setFocusedNodeId(nodeId);
    }
  };

  const handleDragEnd = (e) => {
    if (isDragging && draggedNodeType) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - canvasRect.left) / zoom - position.x;
      const y = (e.clientY - canvasRect.top) / zoom - position.y;
      
      const { x: snappedX, y: snappedY } = snapToGrid(x, y);
      
      const newNode = {
        id: Date.now().toString(),
        type: draggedNodeType,
        x: snappedX,
        y: snappedY,
        text: '',
        title: '',
        width: draggedNodeType === 'text' ? 'auto' : 200,
        height: draggedNodeType === 'text' ? 'auto' : 200,
        color: draggedNodeType === 'postit' ? '#FFFFA5' : '#FFFFFF',
      };
      
      onAddNode(newNode);
    }
    setIsDragging(false);
    setDraggedNodeType(null);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-screen overflow-hidden">
      <div className="flex-grow relative">
        <Canvas
          ref={canvasRef}
          nodes={nodes}
          setNodes={setNodes}
          zoom={zoom}
          position={position}
          activeTool={activeTool}
          handlePanStart={handlePanStart}
          handlePanMove={handlePanMove}
          handlePanEnd={handlePanEnd}
          onNodeUpdate={onUpdateNode}
          focusedNodeId={focusedNodeId}
          onNodeFocus={setFocusedNodeId}
          onNodeDelete={onDeleteNode}
          onNodeClick={handleNodeClick}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDragEnd}
        />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="fixed bottom-6 right-6 rounded-full p-3 bg-white shadow-lg hover:bg-gray-50"
                onClick={() => {
                  const position = findAvailablePosition(nodes);
                  onAddNode({
                    id: Date.now().toString(),
                    type: 'blank',
                    x: position.x,
                    y: position.y,
                    width: 200,
                    height: 200,
                    color: '#FFFFFF',
                  });
                }}
              >
                <PlusIcon className="h-6 w-6 text-gray-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add a blank note. Click it to start an AI conversation.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Toolbar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          handleZoom={handleZoom}
          zoom={zoom}
          nodes={nodes}
          onDragStart={(nodeType) => {
            setIsDragging(true);
            setDraggedNodeType(nodeType);
          }}
        />
      </div>
      <AISidePanel
        isOpen={sidePanelOpen}
        onClose={() => setSidePanelOpen(false)}
        initialQuestion={initialAIMessage}
        onSendMessage={(message) => {
          console.log("Sending message to AI:", message);
        }}
      />
      <div className="fixed bottom-12 right-12 z-50">
        <ReportList
          reports={reports}
          onAddReport={onAddReport}
          onEditReport={onUpdateReport}
        />
      </div>
    </div>
  );
};

export default MindMapView;