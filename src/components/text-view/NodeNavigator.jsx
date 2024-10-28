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
import { toast } from 'sonner';
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
  const [openFolders, setOpenFolders] = useState({});
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const nodeRefs = useRef({});

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

  const handleCreateFolder = (folderName) => {
    const newFolder = {
      id: `folder-${Date.now()}`,
      title: folderName,
      type: 'folder',
      nodes: []
    };
    setFolders([...folders, newFolder]);
    toast.success('Folder created successfully');
  };

  const handleToggleFolder = (folderId) => {
    setOpenFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceId = source.droppableId;
    const destId = destination.droppableId;

    // Create new arrays
    const newFolders = [...folders];
    const newNodes = [...navigatorNodes];

    // Handle node movement
    if (result.type === 'node') {
      const nodeId = result.draggableId;
      const node = navigatorNodes.find(n => n.id === nodeId);

      if (destId === 'root') {
        // Moving to root
        if (sourceId !== 'root') {
          // Remove from folder
          const sourceFolder = newFolders.find(f => f.id === sourceId);
          sourceFolder.nodes = sourceFolder.nodes.filter(n => n.id !== nodeId);
          // Add to root
          newNodes.splice(destination.index, 0, node);
        } else {
          // Reorder in root
          const [removed] = newNodes.splice(source.index, 1);
          newNodes.splice(destination.index, 0, removed);
        }
      } else {
        // Moving to folder
        const destFolder = newFolders.find(f => f.id === destId);
        
        if (sourceId === 'root') {
          // Remove from root
          newNodes.splice(source.index, 1);
        } else if (sourceId !== destId) {
          // Remove from source folder
          const sourceFolder = newFolders.find(f => f.id === sourceId);
          sourceFolder.nodes = sourceFolder.nodes.filter(n => n.id !== nodeId);
        }
        
        // Add to destination folder
        if (!destFolder.nodes) destFolder.nodes = [];
        destFolder.nodes.splice(destination.index, 0, node);
      }
    }

    // Update state
    setFolders(newFolders);
    setNavigatorNodes(newNodes);
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
            <Button 
              variant="outline" 
              size="icon"
              className="shrink-0"
            >
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

      <DragDropContext onDragEnd={handleDragEnd}>
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
                  >
                    <Droppable droppableId={folder.id} type="node">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {folder.nodes?.map((node, nodeIndex) => (
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
        onCreateFolder={handleCreateFolder}
      />
    </div>
  );
};

export default NodeNavigator;