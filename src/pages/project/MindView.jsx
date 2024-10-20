import React, { useState, useRef, useEffect } from 'react';
import { saveProjectState, loadProjectState } from '../../utils/projectUtils';
import { useZoomPan, findAvailablePosition } from '../../utils/canvasUtils';
import Canvas from '../../components/Canvas';
import Toolbar from '../../components/Toolbar';
import AISidePanel from '../../components/AISidePanel';
import ReportList from '../../components/ReportList';
import ArticleModal from '../../components/ArticleModal';
import { Node } from '../../types/nodeTypes';
import { addExampleNodes } from '../../utils/exampleNodesUtil';

const MindView = ({ project, nodes, setNodes, onAddNode, onUpdateNode, onDeleteNode }) => {
  const [showAIInput, setShowAIInput] = useState(true);
  const [activeTool, setActiveTool] = useState('select');
  const [focusedNodeId, setFocusedNodeId] = useState(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [initialAIMessage, setInitialAIMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [draggedNodeType, setDraggedNodeType] = useState(null);
  const canvasRef = useRef(null);

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
      const exampleNodes = addExampleNodes();
      setNodes(exampleNodes);
      setShowAIInput(false);
    }
  }, [project.id, setNodes]);

  useEffect(() => {
    saveProjectState(project.id, nodes);
  }, [project.id, nodes]);

  const handleAIAsk = (aiInputText) => {
    if (aiInputText.trim()) {
      const position = findAvailablePosition(nodes);
      const newNode = {
        id: Date.now().toString(),
        type: 'basic',
        title: aiInputText,
        abstract: '',
        description: '',
        x: position.x,
        y: position.y,
      };
      onAddNode(newNode);
      setShowAIInput(false);
      setSidePanelOpen(true);
      setInitialAIMessage(aiInputText);
    }
  };

  const handleNodeUpdate = (nodeId, updates) => {
    onUpdateNode(nodeId, updates);
    if (updates.text && nodes.find(node => node.id === nodeId)?.type === 'ai') {
      setSidePanelOpen(true);
    }
  };

  const handleDragEnd = (e) => {
    if (isDragging && draggedNodeType) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - canvasRect.left) / zoom - position.x;
      const y = (e.clientY - canvasRect.top) / zoom - position.y;
      const newNode = {
        id: Date.now().toString(),
        type: draggedNodeType,
        title: 'New Node',
        abstract: '',
        description: '',
        x,
        y,
        width: 200,
        height: 200,
      };
      onAddNode(newNode);
    }
    setIsDragging(false);
    setDraggedNodeType(null);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-screen overflow-hidden">
      <div className="flex-grow relative flex flex-col">
        {showAIInput && (
          <div className="w-full px-4 py-2 bg-white shadow-md z-10">
            <input
              type="text"
              placeholder="Ask AI..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAIAsk(e.target.value);
                  e.target.value = '';
                }
              }}
              className="w-full p-2 border rounded"
            />
          </div>
        )}
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
            onNodeFocus={setFocusedNodeId}
            onNodeDelete={onDeleteNode}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDragEnd}
          />
          <Toolbar
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            handleAIClick={() => setShowAIInput(true)}
            handleZoom={handleZoom}
            zoom={zoom}
            nodes={nodes}
          />
          <ReportList
            reports={project.reports}
            onAddReport={() => {
              setSelectedArticle(null);
              setIsArticleModalOpen(true);
            }}
            onEditReport={(article) => {
              setSelectedArticle(article);
              setIsArticleModalOpen(true);
            }}
          />
        </div>
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
        onClose={() => setIsArticleModalOpen(false)}
        article={selectedArticle}
        onUpdate={(updatedArticle) => {
          console.log("Article updated:", updatedArticle);
        }}
        onSave={(article) => {
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
        }}
        onDelete={(articleId) => {
          const updatedReports = project.reports.filter(report => report.id !== articleId);
          updateProject({ ...project, reports: updatedReports });
        }}
      />
    </div>
  );
};

export default MindView;