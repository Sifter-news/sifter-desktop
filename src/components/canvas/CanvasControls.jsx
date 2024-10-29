import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const CanvasControls = ({ showDeleteConfirmation, setShowDeleteConfirmation, nodeToDelete, onNodeDelete }) => {
  return (
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
          <AlertDialogAction onClick={() => {
            if (nodeToDelete) {
              onNodeDelete(nodeToDelete.id);
            }
            setShowDeleteConfirmation(false);
          }}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CanvasControls;