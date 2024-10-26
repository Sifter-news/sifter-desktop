import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navigator from './Navigator';
import ReportList from './ReportList';
import { findAvailablePosition } from '../utils/canvasUtils';
import { copyNode, pasteNode } from '@/utils/clipboardUtils';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const TextView = ({ 
  project, 
  nodes, 
  onAddNode, 
  onUpdateNode, 
  onDeleteNode, 
  reports, 
  onAddReport, 
  onUpdateReport,
  focusedNodeId,
  onNodeFocus 
}) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [nodeToDelete, setNodeToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const selectedNode = nodes.find(node => node.id === focusedNodeId) || nodes[0];
  const [editedTitle, setEditedTitle] = useState('');
  const [editedDescription, setEditedDescription] = useState('');

  useEffect(() => {
    if (selectedNode) {
      setEditedTitle(selectedNode.title || '');
      setEditedDescription(selectedNode.content || '');
    }
  }, [selectedNode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedNode) {
        if (e.key === 'Delete') {
          if (selectedNode.type === 'ai') {
            setNodeToDelete(selectedNode);
            setShowDeleteConfirmation(true);
          } else {
            onDeleteNode(selectedNode.id);
          }
        } else if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
          copyNode(selectedNode);
          toast.success("Node copied to clipboard");
        } else if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
          const newNode = pasteNode();
          if (newNode) {
            const position = findAvailablePosition(nodes);
            onAddNode({
              ...newNode,
              x: position.x,
              y: position.y
            });
            toast.success("Node pasted from clipboard");
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode, nodes, onAddNode, onDeleteNode]);

  const handleConfirmDelete = () => {
    if (nodeToDelete) {
      onDeleteNode(nodeToDelete.id);
    }
    setShowDeleteConfirmation(false);
    setNodeToDelete(null);
  };

  const handleSave = () => {
    if (selectedNode) {
      onUpdateNode({
        ...selectedNode,
        title: editedTitle,
        content: editedDescription
      });
      setIsEditing(false);
      toast.success("Node updated successfully");
    }
  };

  return (
    <>
      <div className="flex h-full">
        <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
          <Navigator 
            items={nodes} 
            setItems={onUpdateNode} 
            onDocumentClick={(node) => onNodeFocus(node.id)}
            focusedNode={selectedNode}
          />
          <Button onClick={() => {
            const position = findAvailablePosition(nodes);
            onAddNode({
              id: Date.now().toString(),
              type: 'text',
              title: `New Node ${nodes.length + 1}`,
              content: '',
              x: position.x,
              y: position.y
            });
          }} className="mt-4 w-full">Add Node</Button>
        </div>
        <div className="flex-grow flex flex-col p-8 overflow-hidden">
          {selectedNode ? (
            <div className="bg-white bg-opacity-80 shadow-lg rounded-lg p-6 relative flex flex-col h-full">
              {isEditing ? (
                <>
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="text-2xl font-bold mb-4"
                    placeholder="Enter title..."
                  />
                  <Textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="flex-grow w-full p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter description..."
                  />
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                    <Button onClick={handleSave}>Save</Button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-4 cursor-pointer hover:text-blue-500" 
                      onClick={() => setIsEditing(true)}>
                    {selectedNode.title}
                  </h2>
                  <div className="cursor-pointer hover:bg-gray-50 p-2 rounded-md flex-grow"
                       onClick={() => setIsEditing(true)}>
                    {selectedNode.content || selectedNode.description}
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(true)}
                    className="mt-4"
                  >
                    Edit
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-500">
              Select a node from the navigator to view its content.
            </div>
          )}
        </div>
        <div className="fixed bottom-12 right-12 z-50">
          <ReportList
            reports={reports}
            onAddReport={onAddReport}
            onEditReport={onUpdateReport}
          />
        </div>
      </div>
      <AlertDialog open={showDeleteConfirmation} onOpenChange={setShowDeleteConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this AI node?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the AI node and its associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteConfirmation(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TextView;