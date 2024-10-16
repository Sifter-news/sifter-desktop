import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ExportDialog = ({ isOpen, onClose, nodes }) => {
  const handleExport = () => {
    const jsonString = JSON.stringify(nodes, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mind_map_nodes.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Export Mind Map</DialogTitle>
        </DialogHeader>
        <p>Click the button below to download a JSON file containing all nodes in the current mind map.</p>
        <DialogFooter>
          <Button onClick={handleExport}>Download JSON</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;