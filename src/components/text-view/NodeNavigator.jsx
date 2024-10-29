import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { FolderPlus, FolderOpen } from 'lucide-react';
import { DragDropContext } from 'react-beautiful-dnd';
import SearchInput from './SearchInput';
import NodeEditDialog from '../node/NodeEditDialog';
import CreateFolderDialog from './CreateFolderDialog';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useFolderManagement } from './hooks/useFolderManagement';
import FileTreeView from './FileTreeView';
import NodeList from './NodeList';
import { useDebug } from '@/contexts/DebugContext';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [activeView, setActiveView] = useState('nodes');
  const [selectedFiles, setSelectedFiles] = useState(null);
  const fileInputRef = useRef(null);

  const { handleDragEnd } = useDragAndDrop(nodes, onUpdateNode);
  const {
    openFolders,
    draggedOverFolderId,
    handleToggleFolder,
    handleCreateFolder,
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

  const handleCreateNewFolder = (folderName) => {
    const newFolder = handleCreateFolder(folderName);
    setFolders([...folders, newFolder]);
    setShowCreateFolder(false);
  };

  const handleFolderSelect = async (event) => {
    const directory = event.target.files;
    if (directory) {
      const fileStructure = Array.from(directory).map(file => ({
        name: file.name,
        type: file.type || 'folder',
        path: file.webkitRelativePath || file.name,
        size: file.size,
        lastModified: new Date(file.lastModified).toLocaleDateString()
      }));
      setSelectedFiles(fileStructure);
    }
  };

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
    <div className="w-full h-full flex flex-col p-4 rounded-2xl overflow-hidden ml-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowCreateFolder(true)}
        >
          <FolderPlus className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="nodes" className="flex-1">Nodes</TabsTrigger>
          <TabsTrigger value="files" className="flex-1">Files</TabsTrigger>
        </TabsList>
        <TabsContent value="nodes">
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
        </TabsContent>
        <TabsContent value="files" className="h-full">
          <div className="flex flex-col gap-4">
            <div className="flex justify-center">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFolderSelect}
                className="hidden"
                webkitdirectory=""
                directory=""
                multiple
              />
              <Button 
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full max-w-xs"
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Select Folder
              </Button>
            </div>
            <FileTreeView files={selectedFiles} />
          </div>
        </TabsContent>
      </Tabs>

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

      <CreateFolderDialog
        isOpen={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
        onCreateFolder={handleCreateNewFolder}
      />
    </div>
  );
};

export default NodeNavigator;
