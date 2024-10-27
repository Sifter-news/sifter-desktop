import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/supabase';
import InvestigationForm from './InvestigationForm';
import BaseModal from './BaseModal';

const InvestigationModal = ({ isOpen, onClose, investigation, onUpdate }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'generic',
    focus: 'node_person'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (investigation && isOpen) {
      setFormData({
        title: investigation.title || '',
        description: investigation.description || '',
        type: investigation.investigation_type || 'generic',
        focus: 'node_person'
      });
    }
  }, [investigation, isOpen]);

  const handleSave = async () => {
    if (!investigation?.id) {
      toast.error("Invalid investigation ID");
      return;
    }

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('investigations')
        .update({
          title: formData.title.trim(),
          description: formData.description.trim(),
          investigation_type: formData.type
        })
        .eq('id', investigation.id)
        .select()
        .single();

      if (error) throw error;

      toast.success("Investigation updated successfully");
      onUpdate(data);
      onClose();
    } catch (error) {
      console.error('Error updating investigation:', error);
      toast.error("Failed to update investigation");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!investigation?.id) {
      toast.error("Invalid investigation ID");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('investigations')
        .delete()
        .eq('id', investigation.id);

      if (error) throw error;

      toast.success("Investigation deleted successfully");
      onClose();
      navigate('/');
    } catch (error) {
      console.error('Error deleting investigation:', error);
      toast.error("Failed to delete investigation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={investigation ? 'Edit Investigation' : 'Create Investigation'}
      onSave={handleSave}
      onDelete={handleDelete}
      isLoading={isLoading}
      showDelete={true}
    >
      <InvestigationForm 
        formData={formData}
        setFormData={setFormData}
        isLoading={isLoading}
      />
    </BaseModal>
  );
};

export default InvestigationModal;