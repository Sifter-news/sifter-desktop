import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Filter, FolderPlus } from 'lucide-react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import SearchInput from './SearchInput';
import NodeListItem from './NodeListItem';
import NodeTypeSelector from './NodeTypeSelector';
import NodeEditDialog from '../node/NodeEditDialog';
import FolderItem from './FolderItem';
import CreateFolderDialog from './CreateFolderDialog';
import { useDragAndDrop } from './hooks/useDragAndDrop';
import { useFolderManagement } from './hooks/useFolderManagement';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const NodeNavigator = ({ 
  nodes = [], 
  onUpdateNode, 
  onNodeFocus, 
  selectedNode, 
  onAddNode,
  onAIConversation,
  focusedNodeId,
  onDeleteNode 
}) => {
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [navigatorNodes, setNavigatorNodes] = useState([]);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [editingNode, setEditingNode] = useState(null);
  const [folders, setFolders] = useState([]);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const nodeRefs = useRef({});

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

  useEffect(() => {
    if (focusedNodeId && nodeRefs.current[focusedNodeId]) {
      nodeRefs.current[focusedNodeId].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
      setSelectedNodes([focusedNodeId]);
    }
  }, [focusedNodeId]);

  const handleCreateNewFolder = (folderName) => {
    const newFolder = handleCreateFolder(folderName);
    setFolders([...folders, newFolder]);
    setShowCreateFolder(false);
  };

  const filteredNodes = navigatorNodes.filter(node => {
    if (!node) return false;
    const matchesType = selectedType === 'all' || node.nodeType === selectedType;
    const matchesSearch = (node.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (node.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1">
          <SearchInput value={searchQuery} onChange={setSearchQuery} />
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48">
            <NodeTypeSelector selectedType={selectedType} setSelectedType={setSelectedType} />
          </PopoverContent>
        </Popover>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowCreateFolder(true)}
        >
          <FolderPlus className="h-4 w-4" />
        </Button>
      </div>

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
                {folders.map((folder, index) => (
                  <FolderItem
                    key={folder.id}
                    folder={folder}
                    index={index}
                    isOpen={openFolders[folder.id]}
                    onToggle={() => handleToggleFolder(folder.id)}
                    isDraggedOver={draggedOverFolderId === folder.id}
                  >
                    <Droppable droppableId={folder.id} type="node">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {folder.children?.map((node, nodeIndex) => (
                            node && (
                              <div key={node.id} ref={el => nodeRefs.current[node.id] = el}>
                                <NodeListItem
                                  node={node}
                                  index={nodeIndex}
                                  isSelected={selectedNodes.includes(node.id)}
                                  onSelect={(nodeId) => {
                                    setCurrentIndex(nodeIndex);
                                    setSelectedNodes([nodeId]);
                                    onNodeFocus(nodeId);
                                  }}
                                  onFocus={onNodeFocus}
                                  onUpdateNode={onUpdateNode}
                                  onAIConversation={onAIConversation}
                                  isFocused={focusedNodeId === node.id}
                                  onEdit={setEditingNode}
                                  onDelete={onDeleteNode}
                                />
                              </div>
                            )
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </FolderItem>
                ))}
                {filteredNodes.map((node, index) => node && (
                  <div 
                    key={node.id}
                    ref={el => nodeRefs.current[node.id] = el}
                  >
                    <NodeListItem
                      node={node}
                      index={index}
                      isSelected={selectedNodes.includes(node.id)}
                      onSelect={(nodeId) => {
                        setCurrentIndex(index);
                        setSelectedNodes([nodeId]);
                        onNodeFocus(nodeId);
                      }}
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