import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/supabase';
import InvestigationForm from './InvestigationForm';

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
        focus: investigation.investigation_focus || 'node_person'
      });
    }
  }, [investigation, isOpen]);

  const handleSave = async (e) => {
    e?.preventDefault();
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
          investigation_type: formData.type,
          investigation_focus: formData.focus,
          updated_at: new Date().toISOString()
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {investigation ? 'Edit Investigation' : 'Create Investigation'}
          </DialogTitle>
        </DialogHeader>
        <InvestigationForm 
          formData={formData}
          setFormData={setFormData}
          isLoading={isLoading}
        />
        <DialogFooter className="flex justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isLoading}>Delete Investigation</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  investigation and remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
                  Delete Investigation
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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

export default InvestigationModal;