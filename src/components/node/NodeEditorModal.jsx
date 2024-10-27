import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import NodeEditForm from './NodeEditForm';

const NodeEditorModal = ({ isOpen, onClose, node, onUpdate }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>View Node</DialogTitle>
        </DialogHeader>
        <NodeEditForm
          node={node}
          onUpdate={onUpdate}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
};

export default NodeEditorModal;