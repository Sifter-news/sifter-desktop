import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload } from 'lucide-react';
import { toast } from 'sonner';
import NodeTypeSelect from './NodeTypeSelect';
import NodeStyleSelect from './NodeStyleSelect';
import NodeMetadataFields from './NodeMetadataFields';
import DeleteConfirmationDialog from '../text-view/DeleteConfirmationDialog';

const UnifiedNodeEditModal = ({ 
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
      // In a real app, you'd upload this to storage
      setFormData(prev => ({
        ...prev,
        avatar: URL.createObjectURL(file)
      }));
    }
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
          
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={formData.avatar} alt="Avatar" />
                <AvatarFallback>Avatar</AvatarFallback>
              </Avatar>
              <Label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90"
              >
                <Upload className="h-4 w-4" />
              </Label>
              <Input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div className="grid gap-4 py-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <NodeTypeSelect
              value={formData.nodeType}
              onChange={(nodeType) => setFormData(prev => ({ ...prev, nodeType }))}
            />

            <NodeStyleSelect
              value={formData.visualStyle}
              onChange={(visualStyle) => setFormData(prev => ({ ...prev, visualStyle }))}
            />

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

          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button 
                variant="destructive" 
                onClick={() => setShowDeleteDialog(true)}
                disabled={isLoading}
              >
                Delete Node
              </Button>
              {onAIConversation && (
                <Button
                  variant="secondary"
                  onClick={() => onAIConversation(node)}
                  disabled={isLoading}
                >
                  AI Conversation
                </Button>
              )}
            </div>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </DialogFooter>
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

export default UnifiedNodeEditModal;