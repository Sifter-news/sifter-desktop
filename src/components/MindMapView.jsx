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
import ArticleModal from './ArticleModal';
import AIInputSection from './AIInputSection';
import NewArticlePreview from './NewArticlePreview';

const MindMapView = ({ project, nodes, setNodes, onAddNode, onUpdateNode, onDeleteNode }) => {
  const [showAIInput, setShowAIInput] = useState(true);
  const [activeTool, setActiveTool] = useState('select');
  const [focusedNodeId, setFocusedNodeId] = useState(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [aiInputText, setAIInputText] = useState('');
  const [initialAIMessage, setInitialAIMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNodeType, setDraggedNodeType] = useState(null);
  const [showNewArticlePreview, setShowNewArticlePreview] = useState(false);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const canvasRef = useRef(null);
  const aiInputRef = useRef(null);

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
      setShowAIInput(false);
    } else {
      aiInputRef.current?.focus();
    }
  }, [project.id, setNodes]);

  useEffect(() => {
    saveProjectState(project.id, nodes);
  }, [project.id, nodes]);

  const handleAIAsk = () => {
    if (aiInputText.trim()) {
      const position = findAvailablePosition(nodes);
      const newNode = {
        id: Date.now().toString(),
        type: 'ai',
        x: position.x,
        y: position.y,
        text: aiInputText,
        width: 200,
        height: 200,
      };
      onAddNode(newNode);
      setShowAIInput(false);
      setSidePanelOpen(true);
      setInitialAIMessage(aiInputText);
      setAIInputText('');
    }
  };

  const handlePlusButtonClick = () => {
    setShowNewArticlePreview(true);
    setIsArticleModalOpen(true);
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
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDragEnd}
        />
        {showAIInput && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              {showNewArticlePreview && (
                <NewArticlePreview onClose={() => setShowNewArticlePreview(false)} />
              )}
              <AIInputSection
                aiInputText={aiInputText}
                setAIInputText={setAIInputText}
                handleAIAsk={handleAIAsk}
                aiInputRef={aiInputRef}
              />
            </div>
          </div>
        )}
        <Toolbar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          handleAIClick={() => setShowAIInput(true)}
          handleAddNode={onAddNode}
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
      <ArticleModal
        isOpen={isArticleModalOpen}
        onClose={() => {
          setIsArticleModalOpen(false);
          setShowNewArticlePreview(false);
        }}
        article={null}
        onSave={(article) => {
          const newArticle = { ...article, id: Date.now() };
          const updatedReports = [...project.reports, newArticle];
          updateProject({ ...project, reports: updatedReports });
          setIsArticleModalOpen(false);
          setShowNewArticlePreview(false);
        }}
      />
    </div>
  );
};

export default MindMapView;