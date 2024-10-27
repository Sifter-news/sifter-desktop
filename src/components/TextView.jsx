import React, { useState, useEffect } from 'react';
import NodeNavigator from './text-view/NodeNavigator';
import NodeEditor from './text-view/NodeEditor';
import DeleteConfirmationDialog from './text-view/DeleteConfirmationDialog';
import ReportList from './ReportList';
import { copyNode, pasteNode } from '@/utils/clipboardUtils';
import { toast } from 'sonner';

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
  const selectedNode = nodes.find(node => node.id === focusedNodeId) || nodes[0];

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

  return (
    <>
      <div className="flex h-full">
        <NodeNavigator
          nodes={nodes}
          onUpdateNode={onUpdateNode}
          onNodeFocus={onNodeFocus}
          selectedNode={selectedNode}
          onAddNode={onAddNode}
        />
        <div className="flex-grow flex flex-col p-8 overflow-hidden">
          <NodeEditor
            selectedNode={selectedNode}
            onUpdateNode={onUpdateNode}
          />
        </div>
        <div className="fixed bottom-12 right-12 z-50">
          <ReportList
            reports={reports}
            onAddReport={onAddReport}
            onEditReport={onUpdateReport}
          />
        </div>
      </div>
      <DeleteConfirmationDialog
        isOpen={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default TextView;