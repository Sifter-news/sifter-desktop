import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import NodeEditForm from './NodeEditForm';
import BaseModal from '../modals/BaseModal';
import NodeMetadataFields from './NodeMetadataFields';

const NodeEditModal = ({ isOpen, onClose, node, onUpdate }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    avatar: '',
    nodeType: '',
    metadata: {}
  });

  useEffect(() => {
    if (node) {
      setFormData({
        title: node.title || '',
        description: node.description || '',
        avatar: node.avatar || '/default-image.png',
        nodeType: node.nodeType || 'generic',
        metadata: node.metadata || {},
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
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Node"
      onSave={handleSubmit}
    >
      <NodeEditForm
        formData={formData}
        setFormData={setFormData}
        handleImageUpload={handleImageUpload}
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
    </BaseModal>
  );
};

export default NodeEditModal;