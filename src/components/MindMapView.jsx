import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from 'lucide-react';
import { saveProjectState, loadProjectState } from '../utils/projectUtils';
import { useZoomPan, findAvailablePosition } from '../utils/canvasUtils';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import AISidePanel from './AISidePanel';
import ReportList from './ReportList';
import ArticleModal from './ArticleModal';

const MindMapView = ({ project, nodes, setNodes, onAddNode, onUpdateNode, onDeleteNode }) => {
  const [showAIInput, setShowAIInput] = useState(true);
  const [activeTool, setActiveTool] = useState('select');
  const [focusedNodeId, setFocusedNodeId] = useState(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [aiInputText, setAIInputText] = useState('');
  const [initialAIMessage, setInitialAIMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNodeType, setDraggedNodeType] = useState(null);
  const canvasRef = useRef(null);
  const aiInputRef = useRef(null);

  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

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

  const handleAddNode = (type, x, y) => {
    const newNode = {
      id: Date.now().toString(),
      type,
      x,
      y,
      text: '',
      width: 200,
      height: 200,
    };
    onAddNode(newNode);
  };

  const handleNodeUpdate = (nodeId, updates) => {
    onUpdateNode(nodeId, updates);
    if (updates.text && nodes.find(node => node.id === nodeId)?.type === 'ai') {
      setSidePanelOpen(true);
    }
  };

  const handleNodeFocus = (nodeId) => {
    setFocusedNodeId(nodeId);
  };

  const handleNodeDelete = (nodeId) => {
    onDeleteNode(nodeId);
    setFocusedNodeId(null);
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setIsArticleModalOpen(true);
  };

  const handleAddReport = () => {
    setSelectedArticle(null);
    setIsArticleModalOpen(true);
  };

  const handleSaveArticle = (article) => {
    if (article.id) {
      const updatedReports = project.reports.map(report =>
        report.id === article.id ? article : report
      );
      updateProject({ ...project, reports: updatedReports });
    } else {
      const newArticle = { ...article, id: Date.now() };
      const updatedReports = [...project.reports, newArticle];
      updateProject({ ...project, reports: updatedReports });
    }
    setIsArticleModalOpen(false);
    setSelectedArticle(null);
  };

  const handleDeleteArticle = (articleId) => {
    const updatedReports = project.reports.filter(report => report.id !== articleId);
    updateProject({ ...project, reports: updatedReports });
  };

  const handleSendMessage = (message) => {
    // Handle sending message to AI (implement API call here)
    console.log("Sending message to AI:", message);
  };

  const handleDragStart = (nodeType) => {
    setIsDragging(true);
    setDraggedNodeType(nodeType);
  };

  const handleDragEnd = (e) => {
    if (isDragging && draggedNodeType) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - canvasRect.left) / zoom - position.x;
      const y = (e.clientY - canvasRect.top) / zoom - position.y;
      handleAddNode(draggedNodeType, x, y);
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
          onNodeUpdate={handleNodeUpdate}
          focusedNodeId={focusedNodeId}
          onNodeFocus={handleNodeFocus}
          onNodeDelete={handleNodeDelete}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDragEnd}
        />
        {showAIInput && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white rounded-full shadow-lg p-2 flex items-center space-x-2 max-w-xl w-full ring-2 ring-blue-500">
              <Button size="icon" className="rounded-full flex-shrink-0 bg-[#594BFF1A] hover:bg-[#594BFF33]">
                <PlusIcon className="h-6 w-6 text-[#594BFF]" />
              </Button>
              <Input 
                ref={aiInputRef}
                type="text" 
                placeholder="Ask anything about this project" 
                className="flex-grow text-lg border-none focus:ring-0 rounded-full"
                value={aiInputText}
                onChange={(e) => setAIInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAIAsk()}
              />
              <Button 
                className="bg-[#594BFF] hover:bg-[#4B3FD9] text-white rounded-full px-6"
                onClick={handleAIAsk}
              >
                Ask
              </Button>
            </div>
          </div>
        )}
        <Toolbar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          handleAIClick={() => setShowAIInput(true)}
          handleAddNode={handleAddNode}
          handleZoom={handleZoom}
          zoom={zoom}
          nodes={nodes}
          onDragStart={handleDragStart}
        />
        <ReportList
          reports={project.reports}
          onAddReport={handleAddReport}
          onEditReport={handleArticleClick}
        />
      </div>
      <AISidePanel
        isOpen={sidePanelOpen}
        onClose={() => setSidePanelOpen(false)}
        initialQuestion={initialAIMessage}
        onSendMessage={handleSendMessage}
      />
      <ArticleModal
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        article={selectedArticle}
        onSave={handleSaveArticle}
        onDelete={handleDeleteArticle}
      />
    </div>
  );
};

export default MindMapView;