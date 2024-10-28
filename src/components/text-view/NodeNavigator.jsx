import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, FolderPlus } from 'lucide-react';
import SearchInput from './SearchInput';
import NodeListItem from './NodeListItem';
import NodeTypeSelector from './NodeTypeSelector';
import NodeEditDialog from '../node/NodeEditDialog';
import FolderItem from './FolderItem';
import { toast } from 'sonner';
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
  const [folders, setFolders] = useState([]);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [newFolderTitle, setNewFolderTitle] = useState('');
  const [editingNode, setEditingNode] = useState(null);

  useEffect(() => {
    setNavigatorNodes(nodes);
  }, [nodes]);

  const handleCreateFolder = () => {
    if (!newFolderTitle.trim()) {
      toast.error('Please enter a folder name');
      return;
    }

    const newFolder = {
      id: `folder-${Date.now()}`,
      title: newFolderTitle,
      type: 'folder',
      nodes: []
    };

    setFolders(prev => [...prev, newFolder]);
    setNewFolderTitle('');
    setIsNewFolderDialogOpen(false);
    toast.success('Folder created successfully');
  };

  const handleNodeDrop = (nodeId, folderId) => {
    setFolders(prev => prev.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          nodes: [...folder.nodes, nodeId]
        };
      }
      return folder;
    }));

    toast.success('Node moved to folder');
  };

  const getNodesInFolder = (folderId) => {
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return [];
    return nodes.filter(node => folder.nodes.includes(node.id));
  };

  const getUnorganizedNodes = () => {
    const organizedNodeIds = folders.flatMap(folder => folder.nodes);
    return nodes.filter(node => !organizedNodeIds.includes(node.id));
  };

  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="flex justify-between items-center mb-4">
        <SearchInput value={searchQuery} onChange={setSearchQuery} />
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsNewFolderDialogOpen(true)}
        >
          <FolderPlus className="h-4 w-4" />
        </Button>
      </div>

      <NodeTypeSelector selectedType={selectedType} setSelectedType={setSelectedType} />

      <ScrollArea className="flex-grow">
        <div className="space-y-2">
          {folders.map(folder => (
            <FolderItem
              key={folder.id}
              folder={folder}
              nodes={getNodesInFolder(folder.id)}
              onNodeSelect={onNodeFocus}
              focusedNodeId={focusedNodeId}
            />
          ))}

          <div className="mt-4">
            <div className="text-sm font-medium text-gray-500 mb-2">Unorganized Nodes</div>
            {getUnorganizedNodes().map(node => (
              <NodeListItem
                key={node.id}
                node={node}
                onSelect={onNodeFocus}
                onUpdateNode={onUpdateNode}
                onAIConversation={onAIConversation}
                isFocused={focusedNodeId === node.id}
                onEdit={setEditingNode}
                onDelete={onDeleteNode}
              />
            ))}
          </div>
        </div>
      </ScrollArea>

      <Dialog open={isNewFolderDialogOpen} onOpenChange={setIsNewFolderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <Input
            value={newFolderTitle}
            onChange={(e) => setNewFolderTitle(e.target.value)}
            placeholder="Enter folder name"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNewFolderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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