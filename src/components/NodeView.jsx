import React, { useState, useEffect } from 'react';
import NodeNavigator from './text-view/NodeNavigator';
import NodeEditor from './text-view/NodeEditor';
import DeleteConfirmationDialog from './text-view/DeleteConfirmationDialog';
import ReportList from './ReportList';
import { copyNode, pasteNode } from '@/utils/clipboardUtils';
import { toast } from 'sonner';

const NodeView = ({ 
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
  const [localNodes, setLocalNodes] = useState(nodes);
  const selectedNode = localNodes.find(node => node.id === focusedNodeId);

  // Keep local nodes in sync with prop updates
  useEffect(() => {
    setLocalNodes(nodes);
  }, [nodes]);

  const handleLocalNodeUpdate = async (nodeId, updates) => {
    // Update local state immediately
    setLocalNodes(prevNodes => 
      prevNodes.map(node => 
        node.id === nodeId ? { ...node, ...updates } : node
      )
    );
    
    // Propagate update to parent
    await onUpdateNode(nodeId, updates);
  };

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
            onAddNode({
              ...newNode,
              x: Math.random() * 500,
              y: Math.random() * 500
            });
            toast.success("Node pasted from clipboard");
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode, localNodes, onAddNode, onDeleteNode]);

  const handleConfirmDelete = () => {
    if (nodeToDelete) {
      onDeleteNode(nodeToDelete.id);
    }
    setShowDeleteConfirmation(false);
    setNodeToDelete(null);
  };

  const sideColumnWidth = 'w-[250px]';

  return (
    <>
      <div className="flex h-[calc(100vh-64px)]">
        <div className={`${sideColumnWidth} min-w-[250px] border-r border-gray-200 overflow-y-auto h-full flex-shrink-0`}>
          <NodeNavigator
            nodes={localNodes}
            onUpdateNode={handleLocalNodeUpdate}
            onNodeFocus={onNodeFocus}
            selectedNode={selectedNode}
            onAddNode={onAddNode}
          />
        </div>

        <div className="flex-1 h-full overflow-y-auto flex justify-center">
          <div className="w-full max-w-3xl px-8 py-6">
            <NodeEditor
              selectedNode={selectedNode}
              onUpdateNode={handleLocalNodeUpdate}
            />
          </div>
        </div>

        <div className={`${sideColumnWidth} min-w-[250px] border-l border-gray-200 h-full flex-shrink-0`}>
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

export default NodeView;
