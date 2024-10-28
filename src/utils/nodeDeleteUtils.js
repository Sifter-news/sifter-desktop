import { toast } from "sonner";

export const handleNodeDelete = async (nodeId, onDelete, onClose, setShowDeleteDialog) => {
  try {
    if (!onDelete) {
      throw new Error("Delete handler not provided");
    }
    
    await onDelete(nodeId);
    toast.success("Node deleted successfully");
    
    if (setShowDeleteDialog) {
      setShowDeleteDialog(false);
    }
    if (onClose) {
      onClose();
    }
  } catch (error) {
    console.error('Error deleting node:', error);
    toast.error("Failed to delete node");
    if (setShowDeleteDialog) {
      setShowDeleteDialog(false);
    }
  }
};