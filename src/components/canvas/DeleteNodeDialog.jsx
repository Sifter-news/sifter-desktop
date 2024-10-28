import React from 'react';
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

const DeleteNodeDialog = ({ 
  isOpen, 
  onClose, 
  nodeToDelete, 
  onDelete, 
  setNodeToDelete 
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this node?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the node and its associated data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            if (nodeToDelete) {
              onDelete(nodeToDelete.id);
              toast.success("Node deleted");
            }
            onClose();
            setNodeToDelete(null);
          }}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteNodeDialog;