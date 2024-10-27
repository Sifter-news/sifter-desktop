import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import NodeMetadataFields from './NodeMetadataFields';
import NodeTypeSelect from './NodeTypeSelect';
import NodeStyleSelect from './NodeStyleSelect';
import NodeAvatar from './NodeAvatar';

const NodeEditDialog = ({ isOpen, onClose, node, onUpdate, onDelete }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    nodeType: '',
    visualStyle: '',
    metadata: {},
    avatar: ''
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

  const handleSubmit = async () => {
    try {
      await onUpdate(node.id, formData);
      toast.success("Node updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update node");
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(node.id);
      toast.success("Node deleted successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to delete node");
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
          
          <NodeAvatar 
            avatar={formData.avatar}
            onAvatarChange={(avatar) => setFormData(prev => ({ ...prev, avatar }))}
          />

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
            <Button 
              variant="destructive" 
              onClick={() => setShowDeleteDialog(true)}
            >
              Delete
            </Button>
            <div className="space-x-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSubmit}>Save changes</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this node
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NodeEditDialog;