import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import SearchInput from './SearchInput';
import NodeEditDialog from '../node/NodeEditDialog';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useFolderManagement } from './hooks/useFolderManagement';
import NodeList from './NodeList';
import { useDebug } from '@/contexts/DebugContext';

const NodeNavigator = ({ 
  nodes = [], 
  onUpdateNode, 
  onNodeFocus, 
  selectedNode, 
  onAddNode,
  onAIConversation,
  focusedNodeId,
  onDeleteNode,
  onNodeHover
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [editingNode, setEditingNode] = useState(null);
  const [folders, setFolders] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const fileInputRef = useRef(null);

  const { handleDragEnd } = useDragAndDrop(nodes, onUpdateNode);
  const {
    openFolders,
    draggedOverFolderId,
    handleToggleFolder,
    handleDragUpdate,
    setDraggedOverFolderId
  } = useFolderManagement();

  const { setDebugData } = useDebug();

  useEffect(() => {
    setDebugData(prev => ({
      ...prev,
      navigatorNodes: nodes
    }));
    console.log('Navigator nodes updated:', nodes);
  }, [nodes, setDebugData]);

  const filteredNodes = nodes.filter(node => {
    if (!node) return false;
    const matchesSearch = (node.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (node.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleNodeClick = (nodeId) => {
    setCurrentIndex(nodes.findIndex(n => n.id === nodeId));
    setSelectedNodes([nodeId]);
    onNodeFocus(nodeId);
  };

  return (
    <div className="w-full h-full flex flex-col p-4 rounded-2xl">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>
      
      <DragDropContext 
        onDragEnd={(result) => {
          setDraggedOverFolderId(null);
          handleDragEnd(result);
        }}
        onDragUpdate={handleDragUpdate}
      >
        <div className="flex-grow overflow-y-auto">
          <NodeList
            nodes={filteredNodes}
            onNodeFocus={onNodeFocus}
            selectedNodes={selectedNodes}
            handleNodeClick={handleNodeClick}
            onUpdateNode={onUpdateNode}
            onAIConversation={onAIConversation}
            focusedNodeId={focusedNodeId}
            onDeleteNode={onDeleteNode}
          />
        </div>
      </DragDropContext>

      {editingNode && (
        <NodeEditDialog
          isOpen={!!editingNode}
          onClose={() => setEditingNode(null)}
          node={editingNode}
          onUpdate={(id, updates) => {
            onUpdateNode(id, updates);
            setEditingNode(null);
          }}
          onDelete={onDeleteNode}
        />
      )}
    </div>
  );
};

export default NodeNavigator;