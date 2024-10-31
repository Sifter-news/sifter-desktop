import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from 'sonner';
import NodeTypeSelect from './NodeTypeSelect';
import NodeStyleSelect from './NodeStyleSelect';
import NodeMetadataFields from './NodeMetadataFields';
import DeleteConfirmationDialog from '../text-view/DeleteConfirmationDialog';
import NodeAvatarSection from './node-edit/NodeAvatarSection';
import NodeBasicFields from './node-edit/NodeBasicFields';
import NodeFooterActions from './node-edit/NodeFooterActions';

const ModalEdit_Node = ({ 
  isOpen, 
  onClose, 
  node, 
  onUpdate,
  onDelete,
  onAIConversation 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    nodeType: 'generic',
    visualStyle: 'default',
    metadata: {},
    avatar: '/default-image.png'
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (node) {
      setFormData({
        title: node.title || '',
        description: node.description || '',
        nodeType: node.nodeType || 'generic',
        visualStyle: node.visualStyle || 'default',
        metadata: node.metadata || {},
        avatar: node.avatar || '/default-image.png'
      });
    }
  }, [node]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatar: URL.createObjectURL(file)
      }));
    }
  };

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsLoading(true);
    try {
      await onUpdate(node.id, formData);
      toast.success("Node updated successfully");
      onClose();
    } catch (error) {
      console.error('Error updating node:', error);
      toast.error("Failed to update node");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(node.id);
      toast.success("Node deleted successfully");
      onClose();
    } catch (error) {
      console.error('Error deleting node:', error);
      toast.error("Failed to delete node");
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  if (!node) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Node</DialogTitle>
          </DialogHeader>
          
          <NodeAvatarSection 
            avatar={formData.avatar} 
            onImageUpload={handleImageUpload} 
          />

          <div className="grid gap-4 py-4">
            <NodeBasicFields
              title={formData.title}
              description={formData.description}
              onFieldChange={handleFieldChange}
            />

            <NodeTypeSelect
              value={formData.nodeType}
              onChange={(nodeType) => handleFieldChange('nodeType', nodeType)}
            />

            <NodeStyleSelect
              value={formData.visualStyle}
              onChange={(visualStyle) => handleFieldChange('visualStyle', visualStyle)}
            />

            <NodeMetadataFields
              nodeType={formData.nodeType}
              metadata={formData.metadata}
              onMetadataChange={(field, value) => 
                handleFieldChange('metadata', { ...formData.metadata, [field]: value })
              }
            />
          </div>

          <NodeFooterActions
            onDelete={() => setShowDeleteDialog(true)}
            onAIConversation={onAIConversation ? () => onAIConversation(node) : undefined}
            onClose={onClose}
            onSave={handleSubmit}
            isLoading={isLoading}
            showAIButton={!!onAIConversation}
          />
        </DialogContent>
      </Dialog>

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
      />
    </>
  );
};

export default ModalEdit_Node;