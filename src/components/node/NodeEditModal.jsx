import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import NodeFormFields from './NodeFormFields';
import NodeAvatarUpload from './NodeAvatarUpload';

const NodeEditModal = ({ isOpen, onClose, node, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    avatar: '',
    name: '',
    age: '',
    organization_name: '',
    founding_date: '',
    object_type: '',
    manufacture_date: '',
    concept_category: '',
    definition: '',
    event_date: '',
    location: '',
  });

  useEffect(() => {
    if (node) {
      setFormData({
        title: node.title || '',
        description: node.description || '',
        avatar: node.avatar || '/default-image.png',
        ...node
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

  const handleSubmit = async () => {
    try {
      await onUpdate(node.id, formData);
      toast.success("Node updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update node");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Node</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <NodeAvatarUpload
            avatar={formData.avatar}
            onImageUpload={handleImageUpload}
          />
          <NodeFormFields
            formData={formData}
            setFormData={setFormData}
            nodeType={node?.nodeType}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NodeEditModal;