import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from 'sonner';
import { supabase } from '@/config/supabase';
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
    nodeType: 'note',
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
        nodeType: node.nodeType || 'note',
        visualStyle: node.visualStyle || 'default',
        metadata: node.metadata || {},
        avatar: node.avatar || '/default-image.png'
      });
    }
  }, [node]);

  const handleSubmit = async () => {
    if (!node?.id) {
      toast.error("Invalid node ID");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsLoading(true);
    try {
      const updates = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        node_type: formData.nodeType,
        visual_style: formData.visualStyle,
        metadata: formData.metadata,
        avatar: formData.avatar,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('node')
        .update(updates)
        .eq('id', node.id)
        .select()
        .single();

      if (error) throw error;

      // Transform the data back to the frontend format
      const updatedNode = {
        ...node,
        ...data,
        nodeType: data.node_type,
        visualStyle: data.visual_style
      };

      await onUpdate(node.id, updatedNode);
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
      const { error } = await supabase
        .from('node')
        .delete()
        .eq('id', node.id);

      if (error) throw error;

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
            onImageUpload={(file) => {
              if (file) {
                setFormData(prev => ({
                  ...prev,
                  avatar: URL.createObjectURL(file)
                }));
              }
            }} 
          />

          <div className="grid gap-4 py-4">
            <NodeBasicFields
              title={formData.title}
              description={formData.description}
              onFieldChange={(field, value) => 
                setFormData(prev => ({ ...prev, [field]: value }))
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <NodeTypeSelect
                value={formData.nodeType}
                onChange={(nodeType) => 
                  setFormData(prev => ({ ...prev, nodeType }))
                }
              />

              <NodeStyleSelect
                value={formData.visualStyle}
                onChange={(visualStyle) => 
                  setFormData(prev => ({ ...prev, visualStyle }))
                }
              />
            </div>

            <NodeMetadataFields
              nodeType={formData.nodeType}
              metadata={formData.metadata}
              onMetadataChange={(field, value) => 
                setFormData(prev => ({
                  ...prev,
                  metadata: { ...prev.metadata, [field]: value }
                }))
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