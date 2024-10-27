import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { supabase } from '@/integrations/supabase/supabase';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';

const ProjectEditDialog = ({ isOpen, onClose, project, onUpdate }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    investigation_type: 'generic'
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (project && isOpen) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        investigation_type: project.investigation_type || 'generic'
      });
    }
  }, [project, isOpen]);

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('investigations')
        .update({
          title: formData.title.trim(),
          description: formData.description.trim(),
          investigation_type: formData.investigation_type,
          updated_at: new Date().toISOString()
        })
        .eq('id', project.id);

      if (error) throw error;

      toast.success("Project updated successfully");
      onUpdate(formData);
      onClose();
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error("Failed to update project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('investigations')
        .delete()
        .eq('id', project.id);

      if (error) throw error;

      toast.success("Project deleted successfully");
      onClose();
      navigate('/');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error("Failed to delete project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Project title"
              className="text-lg font-semibold"
              disabled={isLoading}
            />
            <Select 
              value={formData.investigation_type} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, investigation_type: value }))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select investigation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Due Diligence</SelectLabel>
                  <SelectItem value="pre-deal">Pre-Deal Due Diligence Investigation</SelectItem>
                  <SelectItem value="post-deal">Post-Deal Due Diligence Investigation</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Compliance</SelectLabel>
                  <SelectItem value="aml">Anti-Money Laundering Investigation</SelectItem>
                  <SelectItem value="kyc">Know Your Customer Investigation</SelectItem>
                  <SelectItem value="regulatory">Regulatory Compliance Investigation</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Corporate</SelectLabel>
                  <SelectItem value="fraud">Fraud Investigation</SelectItem>
                  <SelectItem value="background">Background Check Investigation</SelectItem>
                  <SelectItem value="asset">Asset Tracing Investigation</SelectItem>
                  <SelectItem value="generic">Generic Investigation</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Project description"
              className="min-h-[100px]"
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isLoading}>Delete Project</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  project and remove all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={isLoading}>
                  Delete Project
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

export default ProjectEditDialog;