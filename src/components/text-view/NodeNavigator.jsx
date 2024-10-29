import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Filter, FolderPlus, FolderOpen, File } from 'lucide-react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import SearchInput from './SearchInput';
import NodeListItem from './NodeListItem';
import NodeEditDialog from '../node/NodeEditDialog';
import CreateFolderDialog from './CreateFolderDialog';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useFolderManagement } from './hooks/useFolderManagement';
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [navigatorNodes, setNavigatorNodes] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [editingNode, setEditingNode] = useState(null);
  const [folders, setFolders] = useState([]);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [activeView, setActiveView] = useState('nodes');
  const [selectedFiles, setSelectedFiles] = useState(null);
  const fileInputRef = useRef(null);
  const { handleDragEnd } = useDragAndDrop(navigatorNodes, setNavigatorNodes);
  const {
    openFolders,
    draggedOverFolderId,
    handleToggleFolder,
    handleCreateFolder,
    handleDragUpdate,
    setDraggedOverFolderId
  } = useFolderManagement();

  useEffect(() => {
    setNavigatorNodes(nodes);
  }, [nodes]);

  const handleNodeHover = (nodeId) => {
    onNodeHover?.(nodeId);
  };

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

  const renderFileTree = (files) => {
    if (!files) return null;

    return (
      <ScrollArea className="h-[calc(100vh-250px)]">
        <div className="space-y-2 p-2">
          {files.map((file, index) => (
            <div 
              key={file.path} 
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              {file.type === 'folder' ? (
                <FolderOpen className="h-4 w-4 text-blue-500" />
              ) : (
                <File className="h-4 w-4 text-gray-500" />
              )}
              <span className="text-sm truncate">{file.name}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  };

  const filteredNodes = navigatorNodes.filter(node => {
    if (!node) return false;
    const matchesType = selectedType === 'all' || node.nodeType === selectedType;
    const matchesSearch = (node.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (node.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleNodeClick = (nodeId) => {
    setCurrentIndex(nodes.findIndex(n => n.id === nodeId));
    setSelectedNodes([nodeId]);
    onNodeFocus(nodeId);
  };

  return (
    <div className="w-full h-full flex flex-col p-4">
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
              <Droppable droppableId="root" type="node">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {filteredNodes.map((node, index) => node && (
                      <div 
                        key={node.id}
                        ref={el => nodeRefs.current[node.id] = el}
                        onMouseEnter={() => handleNodeHover(node.id)}
                        onMouseLeave={() => handleNodeHover(null)}
                        className={`transition-all duration-200 ${
                          focusedNodeId === node.id ? 'ring-2 ring-blue-500 rounded-lg' : ''
                        }`}
                      >
                        <NodeListItem
                          node={node}
                          index={index}
                          isSelected={selectedNodes.includes(node.id)}
                          onSelect={handleNodeClick}
                          onFocus={onNodeFocus}
                          onUpdateNode={onUpdateNode}
                          onAIConversation={onAIConversation}
                          isFocused={focusedNodeId === node.id}
                          onEdit={setEditingNode}
                          onDelete={onDeleteNode}
                        />
                      </div>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
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
            {renderFileTree(selectedFiles)}
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
