import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import InvestigationForm from './modals/InvestigationForm';
import DeleteConfirmation from './modals/DeleteConfirmation';

const ProjectDetailsModal = ({ isOpen, onClose, projectName, investigationType, projectId, onUpdate }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: projectName || '',
    description: '',
    type: 'generic'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!projectId) {
        console.warn('No project ID provided');
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('investigations')
          .select('*')
          .eq('id', projectId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setFormData({
            title: data.title || projectName || '',
            description: data.description || '',
            type: data.investigation_type || investigationType || 'generic'
          });
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        toast.error("Failed to load project details");
      }
    };

    if (isOpen && projectId) {
      fetchProjectDetails();
    }
  }, [isOpen, projectId, projectName, investigationType]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!projectId) {
      toast.error("Invalid project ID");
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
          investigation_type: formData.type,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
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
    if (!projectId) {
      toast.error("Invalid project ID");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('investigations')
        .delete()
        .eq('id', projectId);

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Investigation Details</DialogTitle>
        </DialogHeader>
        <InvestigationForm 
          formData={formData}
          setFormData={setFormData}
          isLoading={isLoading}
        />
        <DialogFooter className="flex justify-between">
          <DeleteConfirmation onDelete={handleDelete} isLoading={isLoading} />
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailsModal;